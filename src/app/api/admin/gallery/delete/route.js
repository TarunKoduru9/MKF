
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { query } from '@/lib/db';

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // 1. Get the item first to check if we need to delete from Cloudinary
        const checkSql = 'SELECT * FROM gallery_items WHERE id = ?';
        const items = await query(checkSql, [id]);

        if (items.length === 0) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const item = items[0];

        // 2. If it's an image with a public_id, delete from Cloudinary
        if (item.type === 'image' && item.public_id) {
            try {
                await cloudinary.uploader.destroy(item.public_id);
            } catch (cloudError) {
                console.error('Cloudinary Delete Error (continuing to delete from DB):', cloudError);
                // We continue to delete from DB even if Cloudinary fails, 
                // to keep the app state consistent.
            }
        }

        // 3. Delete from Database
        const deleteSql = 'DELETE FROM gallery_items WHERE id = ?';
        await query(deleteSql, [id]);

        return NextResponse.json({ success: true, message: 'Item deleted successfully' });

    } catch (error) {
        console.error('Gallery Delete Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
