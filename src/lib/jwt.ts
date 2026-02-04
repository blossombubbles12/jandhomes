import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// Helper to get secret at runtime to avoid build-time static replacement issues
function getSecretKey() {
    const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'default-secret-key-change-me';
    return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(getSecretKey());
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload;
    } catch (error) {
        // Detailed error logging can be helpful for debugging Vercel logs
        console.error('JWT Verification failed:', error);
        return null;
    }
}
