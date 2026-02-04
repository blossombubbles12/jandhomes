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
                <h2 className="text-3xl font-bold tracking-tight text-white/90">Portfolio Map</h2>
                <p className="text-muted-foreground">
                    Geospatial distribution of all assets in your portfolio.
                </p>
            </div>

            <div className="flex-1 min-h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                <DashboardMap assets={allAssets} />
            </div>
        </div>
    );
}
