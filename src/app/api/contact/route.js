import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        const query = `
      INSERT INTO messages (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;

        const [result] = await pool.execute(query, [name, email, phone || null, message]);

        return NextResponse.json(
            { message: "Message sent successfully", id: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Contact Form Error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
