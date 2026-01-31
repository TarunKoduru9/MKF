import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Ideally, insert into 'newsletters' table or sending to email service
        // For now, we simulate success
        console.log(`Newsletter Subscription: ${email}`);

        return NextResponse.json(
            { message: "Subscribed successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Newsletter Error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe" },
            { status: 500 }
        );
    }
}
