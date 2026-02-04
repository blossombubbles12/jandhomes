import React from 'react';
import { DollarSign, Building, TrendingUp, Layers } from 'lucide-react';
import { Asset } from '@/lib/schema';
import { cn } from '@/lib/utils';

interface PortfolioStatsProps {
    assets: Asset[];
}

export default function PortfolioStats({ assets }: PortfolioStatsProps) {
    const totalValue = assets.reduce((sum, asset) => sum + (Number(asset.currentValuation) || 0), 0);
    const totalIncome = assets.reduce((sum, asset) => sum + (Number(asset.rentalIncome) || 0), 0);
    const totalAssets = assets.length;
    // Approximating ROI for portfolio
    const totalPurchase = assets.reduce((sum, asset) => sum + (Number(asset.purchasePrice) || 0), 0);
    const portfolioRoi = totalPurchase > 0 ? ((totalValue - totalPurchase) / totalPurchase) * 100 : 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(val).replace('NGN', '₦');
    };

    const stats = [
        {
            label: 'Total Portfolio Value',
            value: formatCurrency(totalValue),
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Total Assets',
            value: totalAssets.toString(),
            icon: Building,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Monthly Rental Income',
            value: formatCurrency(totalIncome),
            icon: Layers,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Portfolio ROI',
            value: `${portfolioRoi >= 0 ? '+' : ''}${portfolioRoi.toFixed(2)}%`,
            icon: TrendingUp,
            color: portfolioRoi >= 0 ? 'text-emerald-500' : 'text-rose-500',
            bg: portfolioRoi >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-card/40 p-6 rounded-2xl border border-border backdrop-blur-sm hover:border-border/80 transition-all group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-muted-foreground/80 transition-colors">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={22} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
