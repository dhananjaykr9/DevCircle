import { NextResponse } from "next/server";
import { auth } from "../auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnboarded = req.auth?.user ? (req.auth.user as any).onboarded : false;
    const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

    // Allow public routes and static assets
    const isPublicRoute = req.nextUrl.pathname === '/' ||
        req.nextUrl.pathname.startsWith('/api/') ||
        req.nextUrl.pathname.includes('.');

    // 1. If trying to access Auth pages while logged in
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(isOnboarded ? '/feed' : '/onboarding', req.url));
        }
        return NextResponse.next();
    }

    // 2. If not logged in and trying to access private route
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // 3. If logged in but NOT onboarded, restrict to /onboarding
    if (isLoggedIn && !isOnboarded && req.nextUrl.pathname !== '/onboarding') {
        return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // 4. If logged in AND onboarded, prevent access to /onboarding
    if (isLoggedIn && isOnboarded && req.nextUrl.pathname === '/onboarding') {
        return NextResponse.redirect(new URL('/feed', req.url));
    }

    return NextResponse.next();
});

export const config = {
    // Match all paths except static files and api routes
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
