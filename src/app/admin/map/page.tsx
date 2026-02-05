import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import DashboardMap from '@/components/DashboardMap';

export const dynamic = 'force-dynamic';

export default async function MapViewPage() {
    const allAssets = await db.select().from(assets).where(eq(assets.isDeleted, false));

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Map</h2>
                <p className="text-muted-foreground">
                    Geospatial distribution of all assets in your portfolio.
                </p>
            </div>

            <div className="flex-1 min-h-[600px] rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
                <DashboardMap assets={allAssets} />
            </div>
        </div>
    );
}
