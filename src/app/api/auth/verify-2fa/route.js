import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import pool from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
                        email,
                        userDetails.name || null,
                        userDetails.uid || null,
                        ip,
                        userAgent,
                        status,
                        reason
                    ]
                );
            } catch (e) {
                console.error("Audit Log Failed:", e);
            }
        };

        // Verify OTP
        const codes = await query(
            "SELECT * FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            [email, code]
        );

        if (codes.length === 0) {
            await logAudit('failed', 'Invalid or expired OTP');
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
        }

        // Get User
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            await logAudit('failed', 'User record missing during 2FA');
            return NextResponse.json({ error: "User record not found" }, { status: 404 });
        }
        const user = users[0];

        // Generate ACCESS Token (15 Mins)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
        const accessToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'access'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m") // Short lived
            .sign(secret);

        // Generate REFRESH Token (30 Days)
        const refreshToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            type: 'refresh'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d") // Long lived
            .sign(secret);

        // ACID Transaction for Token Storage & Code Cleanup
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await connection.execute(
                "INSERT INTO refresh_tokens (uid, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
                [user.uid, refreshToken]
            );

            // Cleanup used code
            await connection.execute("DELETE FROM verification_codes WHERE id = ?", [codes[0].id]);

            await connection.commit();
        } catch (dbError) {
            await connection.rollback();
            console.error("Database Transaction Failed:", dbError);
            throw dbError;
        } finally {
            connection.release();
        }

        // Set Cookies
        const cookieStore = await cookies();
        cookieStore.set("session", accessToken, { // Main access token
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 15, // 15 mins
            path: "/",
        });

        cookieStore.set("refresh_token", refreshToken, { // Long term token
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        // Log Success
        await logAudit('success', null, user);

        return NextResponse.json({ message: "Login successful", user });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
