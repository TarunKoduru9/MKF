
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { query } from '@/lib/db';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const type = formData.get('type');
        const category = formData.get('category');
        const title = formData.get('title');

        if (!type || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let src = '';
        let public_id = null;

        if (type === 'image') {
            const file = formData.get('file');
            if (!file) {
                return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
            }

            // Convert file to buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to Cloudinary using a promise wrapper
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'mkf_gallery' }, // Optional: organize in a folder
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            src = uploadResult.secure_url;
            public_id = uploadResult.public_id;

        } else if (type === 'video') {
            src = formData.get('src');
            if (!src) {
                return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
            }
            // Basic validation for URLs could be added here
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        // Insert into Database
        const sql = `
            INSERT INTO gallery_items (type, category, src, public_id, title)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [type, category || 'general', src, public_id, title]);

        return NextResponse.json({
            success: true,
            data: {
                id: result.insertId,
                type,
                category,
                src,
                public_id,
                title
            }
        });

    } catch (error) {
        console.error('Gallery Add Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
