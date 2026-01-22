import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, name, phone, dob, role = "user" } = body;

        // Basic Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length > 0) {
            return NextResponse.json({ error: "Account already exists. Please Login." }, { status: 400 });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a random UID (since we don't have Firebase anymore)
        const uid = crypto.randomUUID();

        // Insert new user
        await query(
            "INSERT INTO users (uid, email, password_hash, name, phone, dob, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [uid, email, hashedPassword, name, phone, dob || null, role]
        );

        return NextResponse.json({ message: "User created successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
