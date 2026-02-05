import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import PortfolioStats from '@/components/PortfolioStats';
import FinancialChart from '@/components/FinancialChart';
import AssetDistribution from '@/components/AssetDistribution';
import { TrendingUp, ArrowUpRight, Activity, Wallet, PieChart, ShoppingCart, Key } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const allAssets = await db.select().from(assets).where(eq(assets.isDeleted, false));

    // Calculate distributions
    const distributionMap = allAssets.reduce((acc: any, asset) => {
        const type = asset.type || 'Other';
        acc[type] = (acc[type] || 0) + (Number(asset.currentValuation) || 0);
        return acc;
    }, {});

    const distributionData = Object.entries(distributionMap).map(([name, value]) => ({
        name,
        value: value as number
    }));

    // SALES ANALYTICS
    const forSaleAssets = allAssets.filter(a => a.listingType === 'For Sale' || a.listingType === 'Development');
    const soldAssets = forSaleAssets.filter(a => a.status === 'Sold');
    const underContractAssets = forSaleAssets.filter(a => a.status === 'Under Contract');
    const availableForSaleAssets = forSaleAssets.filter(a => a.status === 'Available');

    const pipelineVolume = underContractAssets.reduce((acc, a) => acc + (Number(a.currentValuation) || 0), 0);
    const inventoryVolume = availableForSaleAssets.reduce((acc, a) => acc + (Number(a.currentValuation) || 0), 0);
    // Assuming purchasePrice is the base cost, currentValuation is the sale price for sold items? 
    // Or simpler: sold volume is just sum of currentValuation of sold items.
    const soldVolume = soldAssets.reduce((acc, a) => acc + (Number(a.currentValuation) || 0), 0);


    // LEASE ANALYTICS
    const forLeaseAssets = allAssets.filter(a => a.listingType === 'For Lease');
    const leasedAssets = forLeaseAssets.filter(a => a.status !== 'Available'); // Assuming anything not 'Available' is leased/occupied
    const totalLeaseUnits = forLeaseAssets.length;
    const occupancyRate = totalLeaseUnits > 0 ? (leasedAssets.length / totalLeaseUnits) * 100 : 0;
    const annualizedRent = forLeaseAssets.reduce((acc, a) => acc + ((Number(a.rentalIncome) || 0) * 12), 0);


    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Analytics</h2>
                <p className="text-muted-foreground">Real-time data on sales pipelines, rental yields, and asset performance.</p>
            </div>

            <PortfolioStats assets={allAssets} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sales Specific Metrics */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ShoppingCart size={20} />
                        </div>
                        <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Active Inventory</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(inventoryVolume)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{availableForSaleAssets.length} properties available</p>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Activity size={20} />
                        </div>
                        <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Sales Pipeline</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(pipelineVolume)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{underContractAssets.length} properties under contract</p>
                </div>

                {/* Lease Specific Metrics */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Key size={20} />
                        </div>
                        <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Occupancy Rate</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{occupancyRate.toFixed(1)}%</div>
                        {occupancyRate > 90 && (
                            <div className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                Excellent
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{leasedAssets.length}/{totalLeaseUnits} units occupied</p>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Wallet size={20} />
                        </div>
                        <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Proj. Annual Rent</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(annualizedRent)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on current leases</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FinancialChart />
                <AssetDistribution data={distributionData} />
            </div>

            {/* Performance Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Top Performing Assets</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {allAssets.slice(0, 3).map((asset, i) => {
                            const growth = ((Number(asset.currentValuation) - Number(asset.purchasePrice)) / Number(asset.purchasePrice) * 100) || 0;
                            return (
                                <div key={asset.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-foreground">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{asset.name}</p>
                                            <p className="text-xs text-muted-foreground">{asset.type} • {asset.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-sm font-bold text-emerald-600">+{growth.toFixed(1)}% Yield</p>
                                        <p className="text-xs text-muted-foreground">Past 12 Months</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
