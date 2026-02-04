import { db } from './db';
import { auditLogs } from './schema';

export async function logAction(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN',
    entityType: 'ASSET' | 'USER',
    entityId: string | null,
    details: Record<string, unknown> | null
) {
    try {
        await db.insert(auditLogs).values({
            userId,
            action,
            entityType,
            entityId,
            details,
        });
    } catch (error) {
        console.error('Failed to log audit:', error);
    }
}
