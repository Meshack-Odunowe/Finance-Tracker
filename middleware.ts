import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-keys-should-be-at-least-32-chars-long"
);

const PROTECTED_ROUTES = ["/dashboard", "/transactions", "/add-transaction", "/budget"];
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth-token")?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
        if (!token) {
            const url = new URL("/auth/login", request.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            const url = new URL("/auth/login", request.url);
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }
    }

    if (isAuthRoute && token) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch (error) {
            // Invalid token, allow access to auth routes
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
