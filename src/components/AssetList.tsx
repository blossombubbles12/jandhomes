import React from 'react';
import { Asset } from '@/lib/schema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, MapPin, Star, Tag } from 'lucide-react';

interface AssetListProps {
    assets: Asset[];
}

export default function AssetList({ assets }: AssetListProps) {
    // Show top 5 recent for now
    const recentAssets = [...assets].sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }).slice(0, 5);

    const formatCurrency = (val: string | number | null) => {
        if (!val) return '₦0';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(Number(val)).replace('NGN', '₦');
    };

    return (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm overflow-hidden min-h-[400px]">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                <h3 className="font-semibold text-white/90 uppercase text-[10px] tracking-[0.2em]">Latest Inventory</h3>
                <Link href="/admin/assets" className="text-emerald-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center transition-colors">
                    Dashboard <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>
            <div className="divide-y divide-slate-800/50">
                {recentAssets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">No properties registered yet.</div>
                ) : (
                    recentAssets.map(asset => (
                        <div key={asset.id} className="p-4 hover:bg-slate-800/40 transition-all flex items-center justify-between group relative overflow-hidden">
                            <div className="flex items-start space-x-4">
                                <div className={cn(
                                    "w-2 h-2 mt-2 rounded-full",
                                    asset.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                        asset.status === 'Sold' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                            'bg-slate-600'
                                )} />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/assets/${asset.id}`} className="font-medium text-white/90 hover:text-emerald-400 transition-colors truncate block text-sm">
                                            {asset.name}
                                        </Link>
                                        {(asset as any).isFeatured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex items-center text-[11px] text-slate-500 mt-0.5">
                                        <Tag size={10} className="mr-1 text-slate-600" />
                                        <span className="mr-2">{(asset as any).listingType || 'For Sale'}</span>
                                        <MapPin size={10} className="mr-1 text-slate-600" />
                                        <span className="truncate">{asset.city}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-white text-sm">{formatCurrency(asset.currentValuation)}</p>
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter",
                                    asset.status === 'Available' ? "bg-emerald-500/10 text-emerald-500" :
                                        asset.status === 'Sold' ? "bg-rose-500/10 text-rose-500" :
                                            "bg-slate-800 text-slate-400"
                                )}>
                                    {asset.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
