import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, auditLogs } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { signToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signToken({ userId: user.id, role: user.role, email: user.email });

        await logAction(user.id, 'LOGIN', 'USER', user.id, { ip: request.headers.get('x-forwarded-for') || 'unknown' });

        // Create the response object
        const response = NextResponse.json({ success: true, role: user.role });

        // Set the cookie with robust options
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
