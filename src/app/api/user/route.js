import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { verifySession } from '@/lib/auth-helper';

const userSchema = z.object({
    uid: z.string(),
    name: z.string().min(2),
    phone: z.string().min(10).optional().or(z.literal("")),
    address: z.string().optional().nullable().or(z.literal("")),
    district: z.string().optional().nullable().or(z.literal("")),
    state: z.string().optional().nullable().or(z.literal("")),
    pincode: z.string().optional().nullable().or(z.literal("")),
    dob: z.string().optional().nullable().or(z.literal(""))
});



export async function GET(request) {
    const session = await verifySession();
    if (session.error) {
        return NextResponse.json({ error: session.error }, { status: session.status });
    }

    // Use uid from session, ignoring any searchParams for security
    const uid = session.user.uid;

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
        const session = await verifySession();
        if (session.error) {
            return NextResponse.json({ error: session.error }, { status: session.status });
        }

        const body = await request.json();
        // Validate input
        const validatedData = userSchema.parse(body);
        const { uid, name, phone, address, district, state, pincode, dob } = validatedData;

        // Ensure user is updating their own profile
        if (uid !== session.user.uid) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // DB Update
        await query(
            `UPDATE users 
             SET name = ?, phone = ?, address_line = ?, district = ?, state = ?, pincode = ?, dob = ? 
             WHERE uid = ?`,
            [name, phone || null, address || null, district || null, state || null, pincode || null, dob || null, uid]
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
