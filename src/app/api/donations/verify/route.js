import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, paymentId, signature } = body;

        // --- PRODUCTION SECURITY CHECK ---
        // Verify the signature to ensure the request is from Razorpay
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

        // 2. Fetch User Details for Email
        const rows = await query(
            `SELECT d.*, u.name, u.email 
             FROM donations d 
             JOIN users u ON d.uid = u.uid 
             WHERE d.order_id = ?`,
            [orderId]
        );

        if (rows.length === 0) {
            return NextResponse.json({ message: "Donation updated, but record not found for email." });
        }

        const donation = rows[0];

        // 3. Send Thank You Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: donation.email,
            subject: `Thank You for Your Donation! ❤️`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #e11d48; padding: 24px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Thank You!</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Dear <strong>${donation.name}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                            We are incredibly grateful for your generous donation of <strong>₹${donation.amount}</strong> for <strong>${donation.purpose}</strong>. 
                            Your kindness directly supports our mission to bring hope and help to those in need.
                        </p>

                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 5px 0; font-size: 14px; color: #64748b;"><strong>Transaction ID:</strong> ${paymentId}</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #64748b;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>

                        <p style="font-size: 16px; color: #334155;">
                            "No act of kindness, no matter how small, is ever wasted."
                        </p>
                        
                        <p style="font-size: 16px; color: #334155; margin-top: 32px;">With gratitude,</p>
                        <p style="font-size: 16px; font-weight: bold; color: #e11d48;">MKF Trust Team</p>
                    </div>
                </div>
            `,
        };

        // Fire and forget email to speed up response, or await it
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Verified and Email Sent" });

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
    }
}
