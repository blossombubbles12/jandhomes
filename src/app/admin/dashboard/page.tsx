import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import PortfolioStats from '@/components/PortfolioStats';
import DashboardMap from '@/components/DashboardMap';
import AssetList from '@/components/AssetList';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Force dynamic to ensure fresh data on dashboard load
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Fetch only non-deleted assets
    const allAssets = await db.select().from(assets).where(eq(assets.isDeleted, false));

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Executive Overview</h2>
                <p className="text-muted-foreground">Welcome back. Monitoring your active property portfolio.</p>
            </div>

            <PortfolioStats assets={allAssets} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Geographic Distribution</h2>
                        <Link href="/admin/map" className="text-primary hover:underline text-xs font-medium flex items-center">
                            Open Full Map <ArrowUpRight size={14} className="ml-1" />
                        </Link>
                    </div>
                    <DashboardMap assets={allAssets} />
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                    <AssetList assets={allAssets} />
                </div>
            </div>
        </div>
    );
}
