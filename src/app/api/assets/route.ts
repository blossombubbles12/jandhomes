import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, and, ilike, or, sql } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';
import { logAction } from '@/lib/audit';

async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload) return null;
    return (payload as { userId?: string }).userId || null;
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        const conditions = [eq(assets.isDeleted, false)];

        if (status && status !== 'All') conditions.push(eq(assets.status, status));
        if (type && type !== 'All') conditions.push(eq(assets.type, type));
        if (search) {
            conditions.push(or(
                ilike(assets.name, `%${search}%`),
                ilike(assets.address, `%${search}%`),
                ilike(assets.city, `%${search}%`)
            ) as any);
        }

        const results = await db.select().from(assets).where(and(...conditions));
        return NextResponse.json(results);

    } catch (error) {
        console.error('Failed to fetch assets:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.type) {
            return NextResponse.json({ error: 'Name and Type are required' }, { status: 400 });
        }

        // Clean up numeric fields (handle strings from forms)
        const numericFields = ['purchasePrice', 'currentValuation', 'rentalIncome', 'operatingCost', 'landSize', 'buildingSize', 'latitude', 'longitude', 'yearBuilt', 'units', 'floors'];
        const updateData = { ...body };

        numericFields.forEach(field => {
            if (updateData[field] !== undefined) {
                if (updateData[field] === '' || updateData[field] === null) {
                    updateData[field] = null;
                } else {
                    updateData[field] = updateData[field].toString();
                }
            }
        });

        const [newAsset] = await db.insert(assets).values({
            ...updateData,
            id: undefined, // Let DB generate
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false
        }).returning();

        await logAction(userId, 'CREATE', 'ASSET', newAsset.id, { name: newAsset.name });

        return NextResponse.json(newAsset, { status: 201 });

    } catch (error) {
        console.error('Failed to create asset:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
