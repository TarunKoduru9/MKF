import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, name, phone, dob, role = "user" } = body;

        // Basic Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const users = await query("SELECT * FROM users WHERE email = ? OR phone = ?", [email, phone]);
        if (users.length > 0) {
            return NextResponse.json({ error: "Account already exists. Please Login." }, { status: 409 });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a random UID
        const uid = crypto.randomUUID();

        // Insert new user
        await query(
            "INSERT INTO users (uid, email, password_hash, name, phone, dob, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [uid, email, hashedPassword, name, phone, dob || null, role]
        );

        // --- Auto Login Logic ---

        // Generate Tokens
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");

        // Access Token
        const accessToken = await new SignJWT({
            uid: uid,
            email: email,
            name: name,
            role: role,
            type: 'access'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(secret);

        // Refresh Token
        const refreshToken = await new SignJWT({
            uid: uid,
            email: email,
            type: 'refresh'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

        // Store Refresh Token
        await query(
            "INSERT INTO refresh_tokens (uid, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
            [uid, refreshToken]
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

        // Return user object for frontend state
        return NextResponse.json({
            message: "User created and logged in",
            user: { uid, email, name, phone, role }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
