
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

        // Fetch details for these donations
        if (donations.length > 0) {
            const donationIds = donations.map(d => d.id).join(',');
            // Check if donationIds is not empty string to avoid SQL error
            if (donationIds) {
                const details = await query(`
                    SELECT * FROM food_donation_details WHERE donation_id IN (${donationIds})
                `);

                const certificates = await query(`
                    SELECT * FROM donation_certificates WHERE donation_id IN (${donationIds})
                `);

                // Map details to donations
                donations.forEach(donation => {
                    donation.food_details = details.filter(detail => detail.donation_id === donation.id);
                    donation.certificate_details = certificates.filter(cert => cert.donation_id === donation.id)[0] || null;
                });
            }
        }

        return NextResponse.json(donations);

    } catch (error) {
        console.error("Donations API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
