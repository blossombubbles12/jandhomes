import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/jwt';
import { logAction } from '@/lib/audit';

async function getUserIdAndRole() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload) return null;
    return {
        userId: (payload as any).userId as string,
        role: (payload as any).role as string
    };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const [asset] = await db.select().from(assets).where(eq(assets.id, id));

        if (!asset || asset.isDeleted) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json(asset);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const auth = await getUserIdAndRole();

        if (!auth?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Remove immutable or generated fields to prevent DB errors
        const { id: _, createdAt: __, updatedAt: ___, isDeleted: ____, ...updateData } = body;

        // Clean numeric fields - convert empty strings to null, valid values to strings
        const numericFields = ['purchasePrice', 'currentValuation', 'rentalIncome', 'operatingCost', 'landSize', 'buildingSize', 'latitude', 'longitude', 'yearBuilt', 'units', 'floors'];
        numericFields.forEach(field => {
            if (updateData[field] !== undefined) {
                // If it's an empty string or null, set to null
                if (updateData[field] === '' || updateData[field] === null) {
                    updateData[field] = null;
                } else {
                    // Convert to string for PostgreSQL numeric type
                    updateData[field] = updateData[field].toString();
                }
            }
        });

        const [updatedAsset] = await db.update(assets)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(assets.id, id))
            .returning();

        if (!updatedAsset) {
            return NextResponse.json({ error: 'Asset not found or no changes made' }, { status: 404 });
        }

        await logAction(auth.userId, 'UPDATE', 'ASSET', id, { changes: Object.keys(updateData) });

        return NextResponse.json(updatedAsset);
    } catch (error: any) {
        console.error('Update asset error:', error);
        return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const auth = await getUserIdAndRole();

        if (!auth?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const forceDelete = searchParams.get('force') === 'true';

        if (forceDelete) {
            if (auth.role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
            }
            await db.delete(assets).where(eq(assets.id, id));
            await logAction(auth.userId, 'DELETE', 'ASSET', id, { type: 'HARD_DELETE' });
        } else {
            await db.update(assets).set({ isDeleted: true, updatedAt: new Date() }).where(eq(assets.id, id));
            await logAction(auth.userId, 'DELETE', 'ASSET', id, { type: 'SOFT_DELETE' });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
