import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// --- Rate Limiting State (In-Memory for Edge) ---
const rateLimitMap = new Map();

function applyRateLimit(key, limit, windowMs) {
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { count: 0, lastReset: Date.now() });
    }

    const keyData = rateLimitMap.get(key);

    if (Date.now() - keyData.lastReset > windowMs) {
        keyData.count = 0;
        keyData.lastReset = Date.now();
    }

    keyData.count += 1;
    return keyData.count <= limit;
}

export async function proxy(request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // 1. Outer Layer: IP Rate Limiting (DDoS Protection)
    // Limit: 10,000 requests per 15 mins
    if (!applyRateLimit(ip, 10000, 15 * 60 * 1000)) {
        return new NextResponse(JSON.stringify({ error: "Too Many Requests (IP)" }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
        });
    }

    // 2. HPP (HTTP Parameter Pollution) Protection
    const searchParams = request.nextUrl.searchParams;
    for (const key of searchParams.keys()) {
        if (searchParams.getAll(key).length > 1) {
            return new NextResponse(JSON.stringify({ error: "HTTP Parameter Pollution Detected" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    const response = NextResponse.next();

    // 3. Security Headers (Helmet Equivalence)
    const headers = response.headers;
    headers.set("X-DNS-Prefetch-Control", "on");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), unload=*");
    headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.googleapis.com https://*.facebook.net https://connect.facebook.net https://*.facebook.com https://*.fbcdn.net; connect-src 'self' https://lumberjack.razorpay.com https://*.googleapis.com https://*.facebook.com https://*.fbcdn.net; img-src 'self' data: https://*.facebook.com https://platform-lookaside.fbsbx.com https://*.googleusercontent.com https://*.fbcdn.net; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://www.facebook.com https://web.facebook.com;"
    );

    // 4. Auth Logic & Inner Rate Limiting
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    if (session) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
            const { payload } = await jwtVerify(session, secret);
            const userId = payload.uid;

            // Inner Layer: User ID Rate Limiting (Abuse Protection)
            // Limit: 5,000 requests per 15 mins
            if (userId && !applyRateLimit(`user:${userId}`, 5000, 15 * 60 * 1000)) {
                return new NextResponse(JSON.stringify({ error: "Too Many Requests (User)" }), {
                    status: 429,
                    headers: { "Content-Type": "application/json" }
                });
            }
        } catch (error) {
            // Invalid session, ignore for rate limiting but handle in protected routes
        }
    }

    const protectedRoutes = ["/my-account", "/cart"];
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected) {
        if (!session) return NextResponse.redirect(new URL("/login", request.url));
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
            await jwtVerify(session, secret);
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (pathname === "/login" && session) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
            await jwtVerify(session, secret);
            return NextResponse.redirect(new URL("/my-account", request.url));
        } catch (e) { }
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
