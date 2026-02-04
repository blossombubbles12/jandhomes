import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const envAuthSecret = !!process.env.AUTH_SECRET;
        const envJwtSecret = !!process.env.JWT_SECRET;

        // Don't expose the actual secret, just whether it exists
        const envStatus = {
            authSecretSet: envAuthSecret,
            jwtSecretSet: envJwtSecret,
            usingDefault: !envAuthSecret && !envJwtSecret
        };

        if (!token) {
            return NextResponse.json({
                status: 'missing_token',
                message: 'No token cookie found in request',
                envStatus
            });
        }

        const payload = await verifyToken(token);

        if (payload) {
            return NextResponse.json({
                status: 'valid',
                message: 'Token verified successfully',
                userId: (payload as any).userId,
                role: (payload as any).role,
                envStatus
            });
        } else {
            return NextResponse.json({
                status: 'invalid',
                message: 'Token verification failed. Signature mismatch or expired.',
                envStatus
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
