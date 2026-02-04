import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// Use AUTH_SECRET if it exists, matching the user's .env.local
const SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'default-secret-key-change-me';
const SECRET_KEY = new TextEncoder().encode(SECRET);

export async function signToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        console.error('JWT Verification failed:', error);
        return null;
    }
}
