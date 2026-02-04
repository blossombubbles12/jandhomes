"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    Edit,
    Trash2,
    Building2,
    MapPin,
    ArrowUpDown,
    Plus,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Asset {
    id: string;
    name: string;
    type: string;
    status: string;
    listingType?: string;
    isFeatured?: boolean;
    city: string;
    state: string;
    currentValuation: string;
}

export function AssetTable() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.set('search', search);
                if (statusFilter !== 'All') params.set('status', statusFilter);
                if (typeFilter !== 'All') params.set('type', typeFilter);

                const res = await fetch(`/api/assets?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch assets');
                const data = await res.json();
                setAssets(data);
            } catch (err) {
                toast.error('Could not load assets');
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchAssets, 300);
        return () => clearTimeout(debounce);
    }, [search, statusFilter, typeFilter]);

    const formatNaira = (val: string | number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(Number(val)).replace('NGN', '₦');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        try {
            const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            toast.success('Asset deleted successfully');
            setAssets(assets.filter(a => a.id !== id));
        } catch (err) {
            toast.error('Failed to delete asset');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search portfolio..."
                        className="pl-9 bg-slate-900/50 border-slate-800 focus:border-emerald-500 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Land">Land</option>
                        <option value="Internal">Internal Assets</option>
                    </select>

                    <select
                        className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Under Contract">Under Contract</option>
                        <option value="Renovation">Renovation</option>
                    </select>

                    <Button variant="premium" asChild>
                        <Link href="/admin/assets/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Asset
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Asset Details</th>
                                <th className="px-6 py-4">Structure / Listing</th>
                                <th className="px-6 py-4">Current Status</th>
                                <th className="px-6 py-4 text-right">Market Valuation</th>
                                <th className="px-6 py-4 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            <AnimatePresence mode="popLayout">
                                {loading && assets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center text-slate-500 italic">
                                            Synchronizing portfolio data...
                                        </td>
                                    </tr>
                                ) : assets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center text-slate-500">
                                            No assets match your current configuration.
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map((asset) => (
                                        <motion.tr
                                            key={asset.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-slate-800/20 transition-all"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                            {asset.name}
                                                            {asset.isFeatured && (
                                                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-wider mt-0.5">
                                                            <MapPin className="h-3 w-3" /> {asset.city}, {asset.state}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-300 font-medium">{asset.type}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1 px-1.5 py-0.5 bg-slate-800 w-fit rounded border border-slate-700">
                                                    {asset.listingType || 'For Sale'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                                                    asset.status === 'Available' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        asset.status === 'Sold' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                )}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-white">
                                                {formatNaira(asset.currentValuation)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="hover:bg-emerald-500/10 hover:text-emerald-400" asChild>
                                                        <Link href={`/admin/assets/${asset.id}`} title="View Details">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400" asChild>
                                                        <Link href={`/admin/assets/${asset.id}/edit`} title="Modify Data">
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(asset.id)} title="Archive Asset">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
