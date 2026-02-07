
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Force dynamic since we're fetching live data
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sql = 'SELECT * FROM gallery_items ORDER BY created_at DESC';
        const items = await query(sql);

        return NextResponse.json(items);
    } catch (error) {
        console.error('Gallery Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
