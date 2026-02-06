import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, paymentId, signature } = body;

        // --- PRODUCTION SECURITY CHECK ---
        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error("RAZORPAY_KEY_SECRET is not defined in env");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest('hex');

        if (generated_signature !== signature) {
            console.error("Invalid Signature", { generated: generated_signature, received: signature });
            return NextResponse.json({ error: "Invalid Payment Signature" }, { status: 400 });
        }
        // ---------------------------------

        // 1. Update Donation Status in DB
        await query(
            "UPDATE donations SET payment_status = 'success', transaction_id = ? WHERE order_id = ?",
            [paymentId, orderId]
        );

        // 2. Fetch Donation Details
        const donations = await query("SELECT * FROM donations WHERE order_id = ?", [orderId]);
        if (donations.length === 0) {
            return NextResponse.json({ message: "Donation updated, but record not found." });
        }

        const donation = donations[0];
        const email = donation.guest_email; // Priority to guest email
        const guestName = donation.guest_name || "Donor";
        let finalUid = donation.uid;
        let isNewAccount = false;
        let generatedPassword = "";

        // 3. User Check & Auto-Creation Logic
        // Only if it was a guest donation (uid='guest') and we have an email
        if (finalUid === 'guest' && email) {
            const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email]);

            if (existingUsers.length > 0) {
                // User Exists: Link donation to this user
                finalUid = existingUsers[0].uid;
                await query("UPDATE donations SET uid = ? WHERE order_id = ?", [finalUid, orderId]);
            } else {
                // New User: Create Account
                isNewAccount = true;
                finalUid = crypto.randomUUID();
                generatedPassword = Math.random().toString(36).slice(-8) + "!Aa"; // Random 8 chars + complexity
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(generatedPassword, salt);

                await query(
                    "INSERT INTO users (uid, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
                    [finalUid, email, hashedPassword, guestName, 'user']
                );

                // Update donation to link to new user
                await query("UPDATE donations SET uid = ? WHERE order_id = ?", [finalUid, orderId]);
            }
        }

        // 4. Prepare Email Content
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #dc2626; padding: 24px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">Thank You!</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Dear <strong>${guestName}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                        We are incredibly grateful for your generous donation of <strong>₹${donation.amount}</strong> for <strong>${donation.purpose}</strong>. 
                        Your kindness directly supports our mission.
                    </p>

                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
                        <p style="margin: 5px 0; font-size: 14px; color: #64748b;"><strong>Transaction ID:</strong> ${paymentId}</p>
                        <p style="margin: 5px 0; font-size: 14px; color: #64748b;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
        `;

        if (isNewAccount) {
            emailHtml += `
                    <div style="background-color: #eff6ff; border: 1px solid #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">Account Created</h3>
                        <p style="font-size: 14px; color: #1e3a8a;">We have created an account for you to track your donations.</p>
                        <p style="margin: 5px 0; font-size: 14px; color: #334155;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0; font-size: 14px; color: #334155;"><strong>Password:</strong> ${generatedPassword}</p>
                        <p style="font-size: 12px; color: #64748b; margin-top: 10px;">Please login and change your password immediately.</p>
                        <div style="text-align: center; margin-top: 15px;">
                             <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">Login Now</a>
                        </div>
                    </div>
            `;
        } else {
            emailHtml += `
                    <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
                        This donation has been linked to your registered account <strong>${email}</strong>. 
                        You can view your donation history by logging in.
                    </p>
            `;
        }

        emailHtml += `
                    <p style="font-size: 16px; color: #334155; margin-top: 32px;">With gratitude,</p>
                    <p style="font-size: 16px; font-weight: bold; color: #dc2626;">MKF Trust Team</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: isNewAccount ? `Donation Receipt & Account Detail` : `Thank You for Your Donation! ❤️`,
            html: emailHtml,
        };

        if (email) {
            await transporter.sendMail(mailOptions);
        }

        return NextResponse.json({ success: true, message: "Verified and Email Sent" });

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
    }
}
