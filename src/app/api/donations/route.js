import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { jwtVerify } from 'jose';
import Razorpay from 'razorpay';

import { foodPackages, specialPackages } from '@/lib/constants';

export async function POST(request) {
    try {
        const body = await request.json();
        const { amount, purpose, uid, guest_name, guest_email, guest_phone, anonymous, cart } = body;

        let finalAmount = amount;

        // SERVER-SIDE PRICE VALIDATION
        // If a cart is provided, we recalculate the total based on trusted prices in constants.js
        if (cart && Array.isArray(cart) && cart.length > 0) {
            let calculatedTotal = 0;

            cart.forEach(cartItem => {
                // Find in foodPackages
                let product = foodPackages.find(p => p.id === cartItem.id.split('-')[0]);
                let price = 0;

                if (product) {
                    // It's a food package, check variant
                    const variant = cartItem.id.includes('-veg') || cartItem.title.includes('(Veg)') ? 'veg' : 'nonveg';
                    // Fallback logic if ID parsing isn't perfect, but relies on 'variants' structure
                    price = product.variants ? (product.variants[variant] || product.variants.nonveg) : 0;

                    // Specific fix: The cart IDs in store.js are like "food-20-veg". 
                    // Let's refine logical lookup:
                    if (cartItem.id.includes('-veg')) price = product.variants.veg;
                    else if (cartItem.id.includes('-nonveg')) price = product.variants.nonveg;
                    else price = Object.values(product.variants)[0]; // Fallback
                } else {
                    // Check specialPackages
                    product = specialPackages.find(p => p.id === cartItem.id);
                    if (product) price = product.price;
                }

                if (price > 0) {
                    calculatedTotal += price * cartItem.quantity;
                }
            });

            // If we successfully calculated a total, use it. 
            // This prevents "frontend hackers" from sending { amount: 1 } for a 5000rs item.
            if (calculatedTotal > 0) {
                finalAmount = calculatedTotal;
            }
        }

        if (!finalAmount || !purpose) {
            return NextResponse.json({ error: 'Amount and Purpose required' }, { status: 400 });
        }

        // Initialize Razorpay Instance
        // IMPORTANT: Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are in .env
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(finalAmount * 100), // Request comes in Rupees, convert to paise (integer)
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

        // Ensure 'guest' user exists if no uid provided
        const finalUid = uid || 'guest';

        // Check if user exists, if not create 'guest' placeholder
        // Using INSERT IGNORE to be safe without select
        await query(
            `INSERT IGNORE INTO users (uid, email, password_hash, name, phone, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['guest', 'guest@mkftrust.org', 'guest_placeholder', 'Guest User', '0000000000', 'user']
        );

        // 2. Save "Pending" transaction to DB.
        await query(
            'INSERT INTO donations (uid, amount, purpose, payment_status, order_id, guest_name, guest_email, guest_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [finalUid, amount, purpose, 'pending', orderId, guest_name || null, guest_email || null, guest_phone || null]
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
        const email = payload.email;

        // Fetch Donations (Include those made as guest with same email)
        const donations = await query(
            "SELECT * FROM donations WHERE uid = ? OR (guest_email = ? AND guest_email IS NOT NULL) ORDER BY created_at DESC",
            [uid, email]
        );

        return NextResponse.json({ donations });
    } catch (error) {
        console.error("Fetch Donations Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
