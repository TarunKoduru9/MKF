import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
        try {
            const { payload } = await jwtVerify(session, secret);
            if (payload.role !== 'admin') throw new Error("Not Admin");
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const users = await query(`
            SELECT uid, name, email, phone, role, district, state, created_at 
            FROM users 
            ORDER BY created_at DESC
            LIMIT 100
        `);

        return NextResponse.json(users);

    } catch (error) {
        console.error("Users API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
