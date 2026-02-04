import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path should be protected
    const isProtected = pathname.startsWith('/admin') ||
        (pathname.startsWith('/api') && !pathname.startsWith('/api/auth') && !pathname.startsWith('/api/debug-auth'));

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const payload = await verifyToken(token);

        if (!payload) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payloadData = payload as { role?: string; userId?: string };
        const userRole = payloadData.role;

        // Admin checks
        if (pathname.startsWith('/admin/users') || pathname.startsWith('/api/users')) {
            if (userRole !== 'admin') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('X-User-Id', payloadData.userId || '');
        requestHeaders.set('X-User-Role', userRole || '');

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
