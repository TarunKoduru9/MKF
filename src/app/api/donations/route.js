import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { jwtVerify } from 'jose';
import Razorpay from 'razorpay';

export async function POST(request) {
    try {
        const body = await request.json();
        const { amount, purpose, uid } = body;

        if (!amount || !purpose) {
            return NextResponse.json({ error: 'Amount and Purpose required' }, { status: 400 });
        }

        // Initialize Razorpay Instance
        // IMPORTANT: Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are in .env
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // Request comes in Rupees, convert to paise (integer)
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        // 1. Create Order in Razorpay
        let order;
        try {
            order = await instance.orders.create(options);
        } catch (razorpayError) {
            console.error("Razorpay Order Creation Failed:", razorpayError);
            return NextResponse.json({ error: "Gateway Error: Could not create order" }, { status: 502 });
        }

        const orderId = order.id;

        // 2. Save "Pending" transaction to DB
        await query(
            'INSERT INTO donations (uid, amount, purpose, payment_status, order_id) VALUES (?, ?, ?, ?, ?)',
            [uid, amount, purpose, 'pending', orderId]
        );

        return NextResponse.json({
            success: true,
            orderId,
            key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
            amount: options.amount // Send amount in paise
        });

    } catch (error) {
        console.error("Donation API Error:", error);
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
