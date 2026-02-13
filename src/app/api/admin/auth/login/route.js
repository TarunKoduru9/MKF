import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Extract IP address from request
function getClientIp(req) {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (realIp) {
        return realIp;
    }
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    return 'unknown';
}

// Log login attempt to audit table
async function logLoginAttempt({ email, userName, uid, ipAddress, userAgent, status, failureReason }) {
    try {
        await query(
            `INSERT INTO login_audit_logs (email, user_name, uid, ip_address, user_agent, login_status, failure_reason) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, userName || null, uid || null, ipAddress, userAgent || null, status, failureReason || null]
        );
    } catch (error) {
        console.error("Failed to log login attempt:", error);
    }
}

export async function POST(req) {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            await logLoginAttempt({
                email: email || 'unknown',
                ipAddress,
                userAgent,
                status: 'failed',
                failureReason: 'Email and Password required'
            });
            return NextResponse.json({ error: "Email and Password required" }, { status: 400 });
        }

        // Get User
        const users = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            await logLoginAttempt({
                email,
                ipAddress,
                userAgent,
                status: 'failed',
                failureReason: 'Invalid credentials'
            });
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const user = users[0];

        // Verify Password
        if (!user.password_hash) {
            await logLoginAttempt({
                email,
                userName: user.name,
                uid: user.uid,
                ipAddress,
                userAgent,
                status: 'failed',
                failureReason: 'Invalid credentials'
            });
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            await logLoginAttempt({
                email,
                userName: user.name,
                uid: user.uid,
                ipAddress,
                userAgent,
                status: 'failed',
                failureReason: 'Invalid credentials'
            });
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Verify Role
        if (user.role !== 'admin') {
            await logLoginAttempt({
                email,
                userName: user.name,
                uid: user.uid,
                ipAddress,
                userAgent,
                status: 'failed',
                failureReason: 'Access Denied. Admins only.'
            });
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

        // Generate ACCESS Token (15 Mins)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
        const accessToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'access'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // Generate REFRESH Token (30 Days)
        const refreshToken = await new SignJWT({
            uid: user.uid,
            email: user.email,
            type: 'refresh'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

        await query("INSERT INTO refresh_tokens (uid, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))", [user.uid, refreshToken]);

        // Set Cookies
        const cookieStore = await cookies();
        cookieStore.set("session", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        cookieStore.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        // Log successful login
        await logLoginAttempt({
            email,
            userName: user.name,
            uid: user.uid,
            ipAddress,
            userAgent,
            status: 'success'
        });

        return NextResponse.json({ message: "Login successful", user: { name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error("Admin Login Error:", error);
        await logLoginAttempt({
            email: 'unknown',
            ipAddress,
            userAgent,
            status: 'failed',
            failureReason: 'Internal Server Error'
        });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
