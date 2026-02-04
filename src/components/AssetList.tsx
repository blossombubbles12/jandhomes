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
        <div className="bg-card rounded-2xl border border-border overflow-hidden min-h-[400px] shadow-sm">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="font-semibold text-foreground/90 uppercase text-[10px] tracking-[0.2em]">Latest Inventory</h3>
                <Link href="/admin/assets" className="text-primary hover:text-primary/80 text-[10px] font-bold uppercase tracking-wider flex items-center transition-colors">
                    View All <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>
            <div className="divide-y divide-border/50 font-sans">
                {recentAssets.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm font-light italic">No properties registered yet.</div>
                ) : (
                    recentAssets.map(asset => (
                        <div key={asset.id} className="p-4 hover:bg-muted/50 transition-all flex items-center justify-between group relative overflow-hidden">
                            <div className="flex items-start space-x-4">
                                <div className={cn(
                                    "w-2 h-2 mt-2 rounded-full",
                                    asset.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                        asset.status === 'Sold' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]' :
                                            'bg-slate-500'
                                )} />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/assets/${asset.id}`} className="font-medium text-foreground/90 hover:text-primary transition-colors truncate block text-sm">
                                            {asset.name}
                                        </Link>
                                        {(asset as any).isFeatured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex items-center text-[11px] text-muted-foreground mt-0.5">
                                        <Tag size={10} className="mr-1 opacity-70" />
                                        <span className="mr-3">{(asset as any).listingType || 'For Sale'}</span>
                                        <MapPin size={10} className="mr-1 opacity-70" />
                                        <span className="truncate">{asset.city}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-foreground text-sm tracking-tight">{formatCurrency(asset.currentValuation)}</p>
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest",
                                    asset.status === 'Available' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                        asset.status === 'Sold' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                                            "bg-muted text-muted-foreground"
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
