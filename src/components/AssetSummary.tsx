import React from 'react';
import { Asset } from '@/lib/schema';
import { Building2, MapPin, DollarSign, TrendingUp, Star, Tag, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetSummaryProps {
    asset: Asset;
}

export default function AssetSummary({ asset }: AssetSummaryProps) {
    const formatCurrency = (val: string | number | null) => {
        if (!val) return '₦0';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(Number(val)).replace('NGN', '₦');
    };

    const purchasePrice = Number(asset.purchasePrice) || 0;
    const currentValuation = Number(asset.currentValuation) || 0;
    const roi = purchasePrice > 0 ? ((currentValuation - purchasePrice) / purchasePrice) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Header / Featured Badge */}
            <div className="flex flex-wrap gap-2">
                {(asset as any).isFeatured && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                        <Star size={12} fill="currentColor" /> Featured property
                    </div>
                )}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                    <Tag size={12} /> {(asset as any).listingType || 'For Sale'}
                </div>
                <div className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                    asset.status === 'Available' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        asset.status === 'Sold' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}>
                    <Activity size={12} /> {asset.status}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 text-slate-500 mb-2">
                        <DollarSign size={18} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Current Value</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(asset.currentValuation)}</div>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 text-slate-500 mb-2">
                        <TrendingUp size={18} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Growth Yield</span>
                    </div>
                    <div className={cn("text-2xl font-bold", roi >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
                        {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                    </div>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 text-slate-500 mb-2">
                        <Building2 size={18} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Asset Class</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{asset.type}</div>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 text-slate-500 mb-2 text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Acquisition</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(asset.purchasePrice)}</div>
                </div>
            </div>

            <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm ring-1 ring-white/5">
                <h3 className="text-lg font-semibold mb-4 text-white/90">Property Narrative</h3>
                <p className="text-slate-400 leading-relaxed text-sm max-w-3xl">{asset.description || 'No detailed description provided for this luxury asset.'}</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Geographic Profile</h4>
                        <div className="flex items-start space-x-3 text-slate-300">
                            <MapPin size={20} className="mt-1 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm leading-6">
                                {asset.address}<br />
                                <span className="font-semibold text-white">{asset.city}, {asset.state}</span><br />
                                <span className="text-slate-500 text-xs italic">{asset.country}</span>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Physical Inventory</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                            <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                <span className="text-xs text-slate-500">Year Built</span>
                                <span className="text-xs font-bold text-white">{asset.yearBuilt || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                <span className="text-xs text-slate-500">Total Units</span>
                                <span className="text-xs font-bold text-white">{asset.units || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                <span className="text-xs text-slate-500">Floors</span>
                                <span className="text-xs font-bold text-white">{asset.floors || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800/50 pb-2">
                                <span className="text-xs text-slate-500">Condition</span>
                                <span className="text-xs font-bold text-emerald-500">{asset.conditionRating || 0}/10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
