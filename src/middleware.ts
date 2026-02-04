import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_ROUTES = ['/admin', '/api/assets'];
const ADMIN_ROUTES = ['/admin/users', '/api/users']; // Removed /admin/settings to allow all auth users

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

    if (!isProtectedRoute && !isAdminRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);
    console.log('Middleware: Token verified payload:', payload);

    if (!payload) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Extend payload type for role check
    const payloadData = payload as { role?: string; userId?: string };
    const userRole = payloadData.role;
    console.log('Middleware: Extracted userId:', payloadData.userId);

    if (isAdminRoute && userRole !== 'admin') {
        // ... existing code
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', payloadData.userId || '');
    requestHeaders.set('X-User-Role', userRole || '');

    console.log('Middleware: Setting headers', {
        userId: requestHeaders.get('X-User-Id'),
        role: requestHeaders.get('X-User-Role')
    });

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
