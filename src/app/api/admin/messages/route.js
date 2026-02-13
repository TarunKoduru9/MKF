import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const query = `
      SELECT * FROM messages 
      ORDER BY created_at DESC
    `;
        const [rows] = await pool.execute(query);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
