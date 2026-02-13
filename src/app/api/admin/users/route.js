import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdminSession } from "@/lib/auth-helper";

export async function GET(req) {
    try {
        const session = await verifyAdminSession();
        if (session.error) {
            return NextResponse.json({ error: session.error }, { status: session.status });
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
