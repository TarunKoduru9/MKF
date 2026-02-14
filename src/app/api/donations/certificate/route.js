import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { orderId, title, firstName, lastName, email, whatsapp, address, docType, docNumber } = body;

        if (!orderId || !firstName || !lastName || !email || !address) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [donations] = await query("SELECT id FROM donations WHERE order_id = ?", [orderId]);

        if (!donations || donations.length === 0) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
        }

        // donations is the array of rows.
        if (Array.isArray(donations) && donations.length === 0) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
        }

        const donationId = donations.id || (donations[0] ? donations[0].id : null);

        if (!donationId) {
            return NextResponse.json({ error: 'Invalid donation record' }, { status: 404 });
        }

        const existing = await query("SELECT id FROM donation_certificates WHERE donation_id = ?", [donationId]);
        if (existing && existing.length > 0) {
            return NextResponse.json({ message: 'Certificate details already submitted' });
        }

        await query(
            `INSERT INTO donation_certificates 
            (donation_id, order_id, title, first_name, last_name, email, whatsapp, address, doc_type, doc_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                donationId,
                orderId,
                title,
                firstName,
                lastName,
                email,
                whatsapp,
                address,
                docType || null,
                docNumber || null
            ]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Certificate API Error:", error);
        return NextResponse.json({ error: 'Failed to save details' }, { status: 500 });
    }
}
