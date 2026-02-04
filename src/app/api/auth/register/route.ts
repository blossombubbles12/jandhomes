import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        // Basic registration for initial setup. 
        // TODO: Restrict this to Admin-only or disable public registration later.
        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const [existingUser] = await db.select().from(users).where(eq(users.email, email));

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);

        // Default to 'viewer' if role provided is invalid or if not provided
        // Ideally validation should be stricter
        const assignedRole = ['admin', 'asset_manager', 'viewer'].includes(role) ? role : 'viewer';

        const [newUser] = await db.insert(users).values({
            email,
            passwordHash,
            role: assignedRole,
        }).returning();

        // Log the creation (if we had a current user context, we'd log who created it)
        await logAction(newUser.id, 'CREATE', 'USER', newUser.id, { role: assignedRole }); // Self-logging for now

        return NextResponse.json({ success: true, userId: newUser.id, role: newUser.role });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
