import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function verifySession(requiredRole = null) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

    let payload;

    // 1. Try to verify Session Token
    if (session) {
        try {
            const verified = await jwtVerify(session, secret);
            payload = verified.payload;

            // Check Role if required
            if (requiredRole && payload.role !== requiredRole) {
                return { error: "Forbidden", status: 403 };
            }

            return { user: payload };

        } catch (e) {
            // Session expired or invalid, fall through to refresh logic
        }
    }

    // 2. If no valid session, try Refresh Token
    const refreshTokenCookie = cookieStore.get("refresh_token");
    if (!refreshTokenCookie) {
        return { error: "Unauthorized", status: 401 };
    }

    try {
        // Verify Refresh Token JWT signature
        const verifiedRefresh = await jwtVerify(refreshTokenCookie.value, secret);
        const refreshPayload = verifiedRefresh.payload;

        // Verify against Database (allow revocation)
        const storedTokens = await query(
            "SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()",
            [refreshTokenCookie.value]
        );

        if (storedTokens.length === 0) {
            return { error: "Invalid refresh token", status: 401 };
        }

        // Verify user exists and check role if required
        const users = await query("SELECT role, name, email, uid FROM users WHERE uid = ?", [refreshPayload.uid]);
        if (users.length === 0) {
            return { error: "User not found", status: 401 };
        }

        const user = users[0];

        if (requiredRole && user.role !== requiredRole) {
            return { error: "Forbidden", status: 403 };
        }

        // Generate NEW Access Token (15 mins)
        payload = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'access'
        };

        const newAccessToken = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(secret);

        // Set New Cookie
        cookieStore.set("session", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        return { user: payload };

    } catch (error) {
        console.error("Session refresh failed:", error);
        return { error: "Session expired", status: 401 };
    }
}

export async function verifyAdminSession() {
    return verifySession('admin');
}
