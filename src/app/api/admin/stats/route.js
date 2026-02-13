import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdminSession } from "@/lib/auth-helper";

export async function GET(req) {
    try {
        const session = await verifyAdminSession();
        if (session.error) {
            return NextResponse.json({ error: session.error }, { status: session.status });
        }

        // Queries
        // 1. Today's Donations
        const todayRes = await query(`
            SELECT SUM(amount) as total 
            FROM donations 
            WHERE payment_status = 'success' 
            AND DATE(created_at) = CURDATE()
        `);

        // 2. Weekly Donations
        const weekRes = await query(`
            SELECT SUM(amount) as total 
            FROM donations 
            WHERE payment_status = 'success' 
            AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
        `);

        // 3. Monthly Donations
        const monthRes = await query(`
            SELECT SUM(amount) as total 
            FROM donations 
            WHERE payment_status = 'success' 
            AND MONTH(created_at) = MONTH(CURDATE()) 
            AND YEAR(created_at) = YEAR(CURDATE())
        `);

        // 4. Total Users
        const usersRes = await query(`SELECT COUNT(*) as count FROM users`);

        return NextResponse.json({
            today: todayRes[0].total || 0,
            weekly: weekRes[0].total || 0,
            monthly: monthRes[0].total || 0,
            users: usersRes[0].count || 0
        });

    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
