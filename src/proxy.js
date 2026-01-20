import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // 1. Setup Protected Routes
    const protectedRoutes = ["/my-account", "/cart"]; // Add others as needed

    // 2. Check if current path is protected
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected) {
        if (!session) {
            // Redirect to Login if no session
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            // Verify Token
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
            await jwtVerify(session, secret);
            // If valid, allow
            return NextResponse.next();
        } catch (error) {
            // If invalid, redirect to Login
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 3. Prevent Logged-in users from visiting Login
    if (pathname === "/login" && session) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
            await jwtVerify(session, secret);
            return NextResponse.redirect(new URL("/my-account", request.url));
        } catch (e) {
            // If invalid, allow login page
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
