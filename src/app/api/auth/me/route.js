import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifySession } from "@/lib/auth-helper";

export async function GET() {
    const session = await verifySession();

    if (session.error) {
        return NextResponse.json({ error: session.error }, { status: session.status });
    }

    // 3. Fetch Full Profile
    try {
        const users = await query("SELECT * FROM users WHERE uid = ?", [session.user.uid]);

        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { password_hash, ...userSafe } = users[0];
        return NextResponse.json({ user: userSafe });

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
