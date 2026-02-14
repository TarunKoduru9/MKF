import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Fetch specific fields from products table where is_active is true
        const products = await query(
            "SELECT id, type, title, price, variants, description, image FROM products WHERE is_active = TRUE"
        );

        // Parse variants JSON if it's returned as a string (depends on driver/mysql version)
        const formattedProducts = products.map(product => ({
            ...product,
            variants: typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants,
            price: Number(product.price) // Ensure price is a number
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Products API Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
