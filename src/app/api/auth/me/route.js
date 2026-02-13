import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { query } from "@/lib/db";

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let payload;

    // 1. Try to verify Session Token
    if (session) {
        try {
            const verified = await jwtVerify(session.value, secret);
            payload = verified.payload;
        } catch (e) {
            // Session expired or invalid, fall through to refresh logic
        }
    }

    // 2. If no valid session, try Refresh Token
    if (!payload) {
        const refreshTokenCookie = cookieStore.get("refresh_token");
        if (!refreshTokenCookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
                return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
            }

            // Generate NEW Access Token (15 mins)
            payload = {
                uid: refreshPayload.uid,
                email: refreshPayload.email,
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
                sameSite: "strict",
                maxAge: 60 * 15,
                path: "/",
            });

        } catch (error) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 });
        }
    }

    // 3. Fetch Full Profile
    try {
        const users = await query("SELECT * FROM users WHERE uid = ?", [payload.uid]);

        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { password_hash, ...userSafe } = users[0];
        return NextResponse.json({ user: userSafe });

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
