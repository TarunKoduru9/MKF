import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        // 1. Check if user exists
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            // Security: Don't reveal if user doesn't exist, but for now we'll be explicit for UX
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 3. Store OTP
        // We can reuse the `verification_codes` table
        await query(
            "INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        // 4. Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL || process.env.EMAIL_USER,
                pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_EMAIL || process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password - MKF Trust",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Use the code below to proceed:</p>
                    <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        return NextResponse.json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Forgot Password Init Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
