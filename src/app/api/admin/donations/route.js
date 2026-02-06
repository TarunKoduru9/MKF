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

        // Fetch Donations with User Info
        // Limit to 100 for now, could add pagination later
        const donations = await query(`
            SELECT 
                d.id, d.order_id, d.amount, d.purpose, d.payment_status, d.created_at,
                d.guest_name, d.guest_email, d.guest_phone,
                u.name as user_name, u.email as user_email, u.phone as user_phone
            FROM donations d
            LEFT JOIN users u ON d.uid = u.uid
            ORDER BY d.created_at DESC
            LIMIT 100
        `);

        return NextResponse.json(donations);

    } catch (error) {
        console.error("Donations API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
