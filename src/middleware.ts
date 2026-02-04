import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Explicitly bypass public routes/assets to avoid any interference
    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/unauthorized') ||
        pathname === '/' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.includes('.') // Static files
    ) {
        return NextResponse.next();
    }

    // 2. Define protected paths
    const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/assets');
    const isAdminRoute = pathname.startsWith('/admin/users') || pathname.startsWith('/api/users');

    if (!isProtectedRoute && !isAdminRoute) {
        return NextResponse.next();
    }

    // 3. Token validation
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

        // 4. Role-based access control
        if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // 5. Inject headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('X-User-Id', payloadData.userId || '');
        requestHeaders.set('X-User-Role', userRole || '');

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error('Middleware Error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

