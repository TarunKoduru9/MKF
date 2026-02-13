import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";

export async function GET(req) {


    try {

        const users = await query(
            "SELECT email, name FROM users WHERE MONTH(dob) = MONTH(NOW()) AND DAY(dob) = DAY(NOW())"
        );

        if (users.length === 0) {
            return NextResponse.json({ message: "No birthdays today." });
        }

        // 2. Setup Email Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL || process.env.EMAIL_USER,
                pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
            },
        });

        // 3. Send Emails
        const results = await Promise.allSettled(users.map(async (user) => {
            const mailOptions = {
                from: { name: "MKF Trust India", address: process.env.SMTP_EMAIL || process.env.EMAIL_USER },
                to: user.email,
                subject: `Happy Birthday, ${user.name}! 🎉`,
                html: `
                    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                        <img src="https://mkftrustindia.org/images/logo.jpg" alt="MKF Trust" style="width: 100px; margin-bottom: 20px;" />
                        <h1 style="color: #E11D48;">Happy Birthday! 🎂</h1>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Wishing you a day filled with happiness and a year filled with joy.</p>
                        <p>Thank you for being a part of our family.</p>
                        <br/>
                        <p>Warmest wishes,</p>
                        <p><strong>MKF Trust Team</strong></p>
                    </div>
                `,
            };
            return transporter.sendMail(mailOptions);
        }));

        const sentCount = results.filter(r => r.status === "fulfilled").length;
        const failedCount = results.filter(r => r.status === "rejected").length;

        return NextResponse.json({
            message: `Processed birthdays. Sent: ${sentCount}, Failed: ${failedCount}`,
            count: sentCount
        });

    } catch (error) {
        console.error("Birthday Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
