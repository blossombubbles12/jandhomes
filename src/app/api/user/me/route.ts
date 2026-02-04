import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { verifyToken } from '@/lib/jwt';
import { logAction } from '@/lib/audit';

async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return (payload as { userId?: string }).userId || null;
}

export async function PUT(request: Request) {
    try {
        const userId = await getUserIdFromToken();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, password } = body;

        // Simple validation
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const updates: Partial<typeof users.$inferInsert> = {
            email
        };

        if (name && name.trim() !== '') {
            updates.name = name;
        }

        if (password && password.trim() !== '') {
            updates.passwordHash = await hashPassword(password);
        }

        await db.update(users)
            .set(updates)
            .where(eq(users.id, userId));

        await logAction(userId, 'UPDATE', 'USER', userId, { changes: Object.keys(updates) });

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
