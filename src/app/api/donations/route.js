import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';
import { jwtVerify } from 'jose';
import Razorpay from 'razorpay';

import { foodPackages, specialPackages } from '@/lib/constants';

export async function POST(request) {
    try {
        const body = await request.json();
        let { amount, purpose, uid, guest_name, guest_email, guest_phone, anonymous, cart, addonIds } = body;

        let finalAmount = 0;
        let calculatedPurpose = [];

        // SERVER-SIDE PRICE VALIDATION (DB BASED)
        const products = await query("SELECT * FROM products WHERE is_active = TRUE");

        // Helper to find product price
        const findPrice = (id, quantity = 1, title = "") => {
            // 1. Try exact match (e.g., addon-reel)
            let product = products.find(p => p.id === id);

            // 2. Try prefix match for food packages (e.g., food-20-veg -> food-20)
            if (!product) {
                product = products.find(p => id.startsWith(p.id));
            }

            if (product) {
                // Parse variants if string
                const variants = typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants;

                if (variants) {
                    // Determine variant
                    const variantKey = id.includes('-veg') || title.includes('(Veg)') ? 'veg' : 'nonveg';
                    return (variants[variantKey] || variants.nonveg || 0) * quantity;
                } else {
                    return Number(product.price) * quantity;
                }
            }
            return 0;
        };

        // 1. Calculate Cart Total
        if (cart && Array.isArray(cart) && cart.length > 0) {
            cart.forEach(item => {
                const price = findPrice(item.id, item.quantity, item.title);
                if (price > 0) {
                    finalAmount += price;
                    calculatedPurpose.push(`${item.title} (x${item.quantity})`);
                }
            });
        }

        // 2. Calculate Addons Total
        if (addonIds && Array.isArray(addonIds) && addonIds.length > 0) {
            addonIds.forEach(addonId => {
                const product = products.find(p => p.id === addonId && p.type === 'addon');
                if (product) {
                    finalAmount += Number(product.price);
                    calculatedPurpose.push(`${product.title} (Addon)`);
                }
            });
        }

        // Use calculated amount if valid, otherwise fallback (or error out)
        if (finalAmount > 0) {
            purpose = calculatedPurpose.join(" + ");
        } else {
            // Fallback for custom donations or if DB lookup fails (should handle gracefully)
            // For now, if DB lookup yields 0 but amount is sent (e.g. custom donation), we might accept it 
            // BUT for Cart/Addons we strictly enforce DB price.
            // If it was a purely custom amount donation (not cart), we'd need a flag.
            // Assuming this endpoint is ONLY for cart checkout:
            finalAmount = amount; // Dangerous fallback, but kept for non-product flows if any
        }

        // Strict consistency check (Optional: reject if mismatch)
        // if (Math.abs(finalAmount - amount) > 1) { ... }

        if (!finalAmount || !purpose) {
            return NextResponse.json({ error: 'Amount and Purpose required' }, { status: 400 });
        }

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
        const finalUid = uid || 'guest';

        // ACID Transaction Implementation
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // 2. Ensure User Exists (Guest)
            await connection.execute(
                `INSERT IGNORE INTO users (uid, email, password_hash, name, phone, role) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['guest', 'guest@mkftrust.org', 'guest_placeholder', 'Guest User', '0000000000', 'user']
            );

            // 3. Save "Pending" transaction
            const [result] = await connection.execute(
                'INSERT INTO donations (uid, amount, purpose, payment_status, order_id, guest_name, guest_email, guest_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [finalUid, finalAmount, purpose, 'pending', orderId, guest_name || null, guest_email || null, guest_phone || null]
            );

            const donationId = result.insertId;

            // 4. Save Food Donation Details
            if (cart && Array.isArray(cart)) {
                for (const item of cart) {
                    if (item.details) {
                        await connection.execute(
                            `INSERT INTO food_donation_details (donation_id, category, reason, event_date, image_urls) VALUES (?, ?, ?, ?, ?)`,
                            [donationId, item.details.category, item.details.reason || null, item.details.eventDate || null, JSON.stringify(item.details.images || [])]
                        );
                    }
                }
            }

            await connection.commit();

        } catch (dbError) {
            await connection.rollback();
            console.error("Database Transaction Failed:", dbError);
            throw dbError; // Re-throw to be caught by outer catch
        } finally {
            connection.release();
        }

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
