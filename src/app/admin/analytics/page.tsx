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
                <h2 className="text-3xl font-bold tracking-tight text-white/90">Portfolio Analytics</h2>
                <p className="text-slate-400">Real-time data on sales pipelines, rental yields, and asset performance.</p>
            </div>

            <PortfolioStats assets={allAssets} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sales Specific Metrics */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <ShoppingCart size={20} />
                        </div>
                        <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Active Inventory</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white">{formatCurrency(inventoryVolume)}</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{availableForSaleAssets.length} properties available</p>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm group hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Activity size={20} />
                        </div>
                        <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Sales Pipeline</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white">{formatCurrency(pipelineVolume)}</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{underContractAssets.length} properties under contract</p>
                </div>

                {/* Lease Specific Metrics */}
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Key size={20} />
                        </div>
                        <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Occupancy Rate</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white">{occupancyRate.toFixed(1)}%</div>
                        {occupancyRate > 90 && (
                            <div className="flex items-center text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                Excellent
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{leasedAssets.length}/{totalLeaseUnits} units occupied</p>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Wallet size={20} />
                        </div>
                        <h4 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Proj. Annual Rent</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white">{formatCurrency(annualizedRent)}</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Based on current leases</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FinancialChart />
                <AssetDistribution data={distributionData} />
            </div>

            {/* Performance Table */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white/90">Top Performing Assets</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {allAssets.slice(0, 3).map((asset, i) => {
                            const growth = ((Number(asset.currentValuation) - Number(asset.purchasePrice)) / Number(asset.purchasePrice) * 100) || 0;
                            return (
                                <div key={asset.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-white">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{asset.name}</p>
                                            <p className="text-xs text-slate-500">{asset.type} • {asset.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-500">+{growth.toFixed(1)}% Yield</p>
                                        <p className="text-xs text-slate-400">Past 12 Months</p>
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
