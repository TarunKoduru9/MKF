import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { jwtVerify } from 'jose';

export async function POST(request) {
    try {
        const body = await request.json();
        const { amount, purpose, uid } = body;

        if (!amount || !purpose) {
            return NextResponse.json({ error: 'Amount and Purpose required' }, { status: 400 });
        }

        // 1. Create Order in Payment Gateway (Razorpay/Stripe placeholder logic)
        const orderId = "order_" + Math.random().toString(36).substr(2, 9);

        // 2. Save "Pending" transaction to DB
        await query('INSERT INTO donations (uid, amount, purpose, payment_status, order_id) VALUES (?, ?, ?, ?, ?)', [uid, amount, purpose, 'pending', orderId]);

        return NextResponse.json({
            success: true,
            orderId,
            key: "test_key_id", // Public Key
            amount: amount * 100 // Amount in smallest currency unit
        });

    } catch (error) {
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = request.cookies.get("session")?.value;
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify Token & Get UID
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
        const { payload } = await jwtVerify(session, secret);
        const uid = payload.uid;

        // Fetch Donations
        const donations = await query(
            "SELECT * FROM donations WHERE uid = ? ORDER BY created_at DESC",
            [uid]
        );

        return NextResponse.json({ donations });
    } catch (error) {
        console.error("Fetch Donations Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
