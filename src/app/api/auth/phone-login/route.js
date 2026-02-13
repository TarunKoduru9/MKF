import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import pool from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        const { uid, phoneNumber, email, displayName } = body;

        if (!uid || !phoneNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Log Audit Helper
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "Unknown";

        const logAudit = async (status, reason, userDetails = {}) => {
            try {
                await query(
                    `INSERT INTO login_audit_logs (email, user_name, uid, ip_address, user_agent, login_status, failure_reason) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userDetails.email || userDetails.phoneNumber || "Unknown",
                        userDetails.name || null,
                        userDetails.uid || uid,
                        ip,
                        userAgent,
                        status,
                        reason || "Phone Login"
                    ]
                );
            } catch (e) {
                console.error("Audit Log Failed:", e);
            }
        };

        // Helper to normalize phone (last 10 digits)
        const normalizePhone = (p) => {
            if (!p) return "";
            const cleaned = p.replace(/\D/g, ""); // Remove non-digits
            return cleaned.slice(-10); // Take last 10
        };

        const phoneLast10 = normalizePhone(phoneNumber);

        let user;
        const users = await query(
            "SELECT * FROM users WHERE phone = ? OR phone LIKE ? OR uid = ?",
            [phoneNumber, `%${phoneLast10}`, uid]
        );

        if (users.length === 0) {
            return NextResponse.json({ error: "User not found. Please Sign Up." }, { status: 404 });
        } else {
            user = users[0];
        }

        // Generate Tokens
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

        // Access Token
        const accessToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'access'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(secret);

        // Refresh Token
        const refreshToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            type: 'refresh'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

        // Store Refresh Token
        await query(
            "INSERT INTO refresh_tokens (uid, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
            [user.uid, refreshToken]
        );

        // Set Cookies
        const cookieStore = await cookies();
        cookieStore.set("session", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 15, // 15 mins
            path: "/",
        });

        cookieStore.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        await logAudit('success', 'Phone Login Success', user);

        return NextResponse.json({ message: "Login successful", user });

    } catch (error) {
        console.error("Phone Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
