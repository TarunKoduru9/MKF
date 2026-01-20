import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const userSchema = z.object({
    uid: z.string(),
    name: z.string().min(2),
    phone: z.string().min(10).optional().or(z.literal("")),
    address: z.string().optional().nullable().or(z.literal("")),
    district: z.string().optional().nullable().or(z.literal("")),
    state: z.string().optional().nullable().or(z.literal("")),
    pincode: z.string().optional().nullable().or(z.literal(""))
});

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json({ error: 'UID required' }, { status: 400 });
    }

    try {
        const users = await query('SELECT * FROM users WHERE uid = ?', [uid]);
        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Don't return password_hash
        const { password_hash, ...userSafe } = users[0];
        return NextResponse.json({ user: userSafe });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        // Validate input
        const validatedData = userSchema.parse(body);
        const { uid, name, phone, address, district, state, pincode } = validatedData;

        // DB Update
        await query(
            `UPDATE users 
             SET name = ?, phone = ?, address_line = ?, district = ?, state = ?, pincode = ? 
             WHERE uid = ?`,
            [name, phone || null, address || null, district || null, state || null, pincode || null, uid]
        );

        // Fetch updated user
        const users = await query('SELECT * FROM users WHERE uid = ?', [uid]);
        const { password_hash, ...userSafe } = users[0];

        return NextResponse.json({ success: true, user: userSafe });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid input or Server Error' }, { status: 400 });
    }
}
