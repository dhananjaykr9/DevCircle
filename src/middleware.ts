import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

function buildCspHeader(nonce: string): string {
    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; ");
}

// Pages accessible without login (demo / read-only browsing)
const PUBLIC_PATHS = new Set([
    '/',
    '/communities',
    '/discussions',
    '/events',
    '/projects',
    '/leaderboard',
    '/jobs',
    '/learning',
    '/mentorship',
    '/about',
    '/guidelines',
    '/code-of-conduct',
    '/help',
    '/faq',
    '/privacy',
    '/terms',
    '/polls',
    '/startups',
]);

// Prefixes that are public (e.g. /communities/nagpur, /events/123)
const PUBLIC_PREFIXES = [
    '/communities/',
    '/api/',
    '/members/',
];

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_PATHS.has(pathname)) return true;
    if (pathname.includes('.')) return true; // static assets
    for (const prefix of PUBLIC_PREFIXES) {
        if (pathname.startsWith(prefix)) return true;
    }
    return false;
}

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnboarded = req.auth?.user ? (req.auth.user as { onboarded?: boolean }).onboarded : false;
    const pathname = req.nextUrl.pathname;
    const isAuthRoute = pathname.startsWith('/auth');
    const _isPublic = isPublicRoute(pathname);

    // Generate per-request nonce for Content-Security-Policy
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const csp = buildCspHeader(nonce);

    const redirect = (path: string) => {
        const res = NextResponse.redirect(new URL(path, req.url));
        res.headers.set('Content-Security-Policy', csp);
        return res;
    };

    const next = () => {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-nonce', nonce);
        const res = NextResponse.next({ request: { headers: requestHeaders } });
        res.headers.set('Content-Security-Policy', csp);
        return res;
    };

    // 1. If trying to access Auth pages while logged in
    if (isAuthRoute) {
        if (isLoggedIn) return redirect(isOnboarded ? '/feed' : '/onboarding');
        return next();
    }

    // 2. If not logged in and trying to access private route
    if (!isLoggedIn && !_isPublic) return redirect('/auth/login');

    // 3. If logged in but NOT onboarded, restrict to /onboarding (allow public routes)
    if (isLoggedIn && !isOnboarded && pathname !== '/onboarding' && !_isPublic) return redirect('/onboarding');

    // 4. If logged in AND onboarded, prevent access to /onboarding
    if (isLoggedIn && isOnboarded && pathname === '/onboarding') return redirect('/feed');

    return next();
});

export const config = {
    // Match all paths except static files and api routes
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
