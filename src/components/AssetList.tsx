"use client";

import React from 'react';
import { Asset } from '@/lib/schema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, MapPin, Star, Tag, Building2 } from 'lucide-react';

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
        <div className="bg-card rounded-2xl border border-border overflow-hidden min-h-[400px] shadow-sm flex flex-col">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-xs uppercase tracking-[0.15em]">Portfolio Activity</h3>
                    <p className="text-[10px] text-muted-foreground font-medium">Recently updated high-value assets</p>
                </div>
                <Link href="/admin/assets" className="text-primary hover:text-primary/90 text-xs font-bold flex items-center transition-all group">
                    Full List <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
            <div className="divide-y divide-border/50 flex-1">
                {recentAssets.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm font-light italic">No properties registered yet.</div>
                ) : (
                    recentAssets.map(asset => {
                        const growth = ((Number(asset.currentValuation) - Number(asset.purchasePrice)) / Number(asset.purchasePrice) * 100) || 0;

                        // Parse media if it's a string
                        let media: any[] = [];
                        try {
                            media = asset.media ? (typeof asset.media === 'string' ? JSON.parse(asset.media) : asset.media) : [];
                        } catch (e) {
                            media = [];
                        }
                        const firstImage = Array.isArray(media) && media.length > 0 ? (typeof media[0] === 'string' ? media[0] : media[0].url) : null;

                        return (
                            <div key={asset.id} className="p-4 hover:bg-muted/30 transition-all group relative">
                                <Link href={`/admin/assets/${asset.id}`} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border/50 bg-muted">
                                        {firstImage ? (
                                            <img src={firstImage} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                                                <Building2 size={24} />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "absolute top-1 left-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
                                            asset.status === 'Available' ? 'bg-emerald-500' :
                                                asset.status === 'Sold' ? 'bg-rose-500' : 'bg-slate-400'
                                        )} />
                                    </div>

                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                                {asset.name}
                                            </h4>
                                            {(asset as any).isFeatured && <Star size={10} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
                                        </div>

                                        <div className="flex items-center text-[11px] text-muted-foreground gap-3">
                                            <div className="flex items-center truncate">
                                                <MapPin size={10} className="mr-1 opacity-60" />
                                                <span className="truncate">{asset.city}</span>
                                            </div>
                                            <div className="flex items-center flex-shrink-0">
                                                <Tag size={10} className="mr-1 opacity-60" />
                                                <span>{(asset as any).listingType || 'For Sale'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <p className="font-bold text-foreground text-xs">{formatCurrency(asset.currentValuation)}</p>
                                            <div className={cn(
                                                "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                                growth >= 0 ? "text-emerald-600 bg-emerald-500/10" : "text-rose-600 bg-rose-500/10"
                                            )}>
                                                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% Yield
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
