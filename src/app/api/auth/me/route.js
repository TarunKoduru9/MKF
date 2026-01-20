import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";

export async function GET() {
    // 1. Await cookies (Next.js 15+)
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        // 2. Verify Token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(session.value, secret);

        // 3. Fetch Full Profile from DB
        const users = await query("SELECT * FROM users WHERE uid = ?", [payload.uid]);

        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { password_hash, ...userSafe } = users[0];

        return NextResponse.json({ user: userSafe });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
