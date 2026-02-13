import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdminSession } from "@/lib/auth-helper";

export async function GET(req) {
    try {
        const session = await verifyAdminSession();
        if (session.error) {
            return NextResponse.json({ error: session.error }, { status: session.status });
        }

        // Get query parameters for filtering and pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const email = searchParams.get('email');
        const status = searchParams.get('status'); // 'success', 'failed', or null for all
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        const offset = (page - 1) * limit;

        // Build WHERE clause dynamically
        let whereConditions = [];
        let queryParams = [];

        if (email) {
            whereConditions.push("email LIKE ?");
            queryParams.push(`%${email}%`);
        }

        if (status && ['success', 'failed'].includes(status)) {
            whereConditions.push("login_status = ?");
            queryParams.push(status);
        }

        if (dateFrom) {
            whereConditions.push("created_at >= ?");
            queryParams.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push("created_at <= ?");
            queryParams.push(dateTo);
        }

        const whereClause = whereConditions.length > 0
            ? "WHERE " + whereConditions.join(" AND ")
            : "";

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM login_audit_logs ${whereClause}`;
        const countResult = await query(countQuery, queryParams);
        const total = countResult[0].total;

        // Get paginated logs (using direct SQL for LIMIT/OFFSET as prepared statements have issues with these)
        const logsQuery = `
            SELECT id, email, user_name, uid, ip_address, user_agent, 
                   login_status, failure_reason, created_at 
            FROM login_audit_logs 
            ${whereClause}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        const logs = await query(logsQuery, queryParams);

        return NextResponse.json({
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error("Audit Logs API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
