import { NextResponse } from "next/server";
import { auth } from "../auth";

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
    '/open-source',
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
    const isOnboarded = req.auth?.user ? (req.auth.user as any).onboarded : false;
    const pathname = req.nextUrl.pathname;
    const isAuthRoute = pathname.startsWith('/auth');
    const _isPublic = isPublicRoute(pathname);

    // 1. If trying to access Auth pages while logged in
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(isOnboarded ? '/feed' : '/onboarding', req.url));
        }
        return NextResponse.next();
    }

    // 2. If not logged in and trying to access private route
    if (!isLoggedIn && !_isPublic) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // 3. If logged in but NOT onboarded, restrict to /onboarding (allow public routes)
    if (isLoggedIn && !isOnboarded && pathname !== '/onboarding' && !_isPublic) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // 4. If logged in AND onboarded, prevent access to /onboarding
    if (isLoggedIn && isOnboarded && pathname === '/onboarding') {
        return NextResponse.redirect(new URL('/feed', req.url));
    }

    return NextResponse.next();
});

export const config = {
    // Match all paths except static files and api routes
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
