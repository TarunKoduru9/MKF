import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// Initialize SMTP Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL || "your-email@gmail.com", // You need to set this
        pass: process.env.SMTP_PASSWORD || "your-app-password",
    },
});

export async function POST(req) {
    try {
        const body = await req.json();

        const { email, password } = body;
        if (!email || !password) return NextResponse.json({ error: "Email and Password required" }, { status: 400 });

        // Get User
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return NextResponse.json({ error: "User not found. Please Sign Up." }, { status: 404 });
        }
        const user = users[0];

        // Verify Password
        if (!user.password_hash) {
            // Backward compatibility for old users? Or force reset?
            return NextResponse.json({ error: "Please reset your password or sign up again." }, { status: 400 });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Store in DB
        await query(
            "INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        // Send Email (Logic unchanged)
        if (!process.env.SMTP_EMAIL) {
            console.log("------------------------------------------");
            console.log(`🔐 DEV MODE OTP for ${email}: ${otp}`);
            console.log("------------------------------------------");
        } else {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: "Your Login Code - MKF Trust",
                text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
                html: `<b>Your verification code is: ${otp}</b><br>It expires in 5 minutes.`,
            });
        }

        return NextResponse.json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
