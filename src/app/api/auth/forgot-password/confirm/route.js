import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, code, newPassword } = body;

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify OTP
        const codes = await query(
            "SELECT * FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            [email, code]
        );

        if (codes.length === 0) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // 2. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update User Password
        await query(
            "UPDATE users SET password_hash = ? WHERE email = ?",
            [hashedPassword, email]
        );

        // 4. Cleanup used OTP
        await query("DELETE FROM verification_codes WHERE id = ?", [codes[0].id]);

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Forgot Password Confirm Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
