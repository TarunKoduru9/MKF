import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and Password required" }, { status: 400 });
        }

        // Get User
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const user = users[0];

        // Verify Password
        if (!user.password_hash) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Verify Role
        if (user.role !== 'admin') {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

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
            .setExpirationTime("15m")
            .sign(secret);

        // Generate REFRESH Token (30 Days)
        const refreshToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            type: 'refresh'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

        await query("INSERT INTO refresh_tokens (uid, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))", [user.uid, refreshToken]);

        // Set Cookies
        const cookieStore = await cookies();
        cookieStore.set("session", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15, // 15 mins
            path: "/",
        });

        cookieStore.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return NextResponse.json({ message: "Login successful", user: { name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error("Admin Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
