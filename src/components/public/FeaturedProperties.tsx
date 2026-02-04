"use client";

import { Asset } from '@/lib/schema';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, BedDouble, Bath, Square, MoveRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils'; // You'll need to export this if not already

interface FeaturedPropertiesProps {
    assets: Asset[];
}

export function FeaturedProperties({ assets }: FeaturedPropertiesProps) {
    if (assets.length === 0) return null;

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Properties</h2>
                        <p className="text-slate-400 max-w-xl text-lg">
                            Explore our handpicked selection of premium properties, offering the best in luxury, comfort, and investment potential.
                        </p>
                    </div>
                    <Link href="/properties" className="group flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                        View All Properties <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assets.map((asset, index) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-900/20"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                        {(asset as any).listingType || 'For Sale'}
                                    </span>
                                    {asset.status !== 'Available' && (
                                        <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">
                                            {asset.status}
                                        </span>
                                    )}
                                </div>
                                <Link href={`/properties/${asset.id}`}>
                                    {/* Placeholder if no media, else first image */}
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-700 ease-out">
                                        {/* Actual image implementation would go here using asset.media */}
                                        <div className="flex flex-col items-center gap-2">
                                            <Building2 className="w-12 h-12 opacity-50" />
                                            <span className="text-xs uppercase tracking-widest font-medium">View Property</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-2xl font-bold text-white">{formatCurrency(asset.currentValuation)}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <Link href={`/properties/${asset.id}`}>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{asset.name}</h3>
                                </Link>
                                <div className="flex items-center text-slate-400 mb-4 text-sm">
                                    <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                                    <span className="truncate">{asset.address}, {asset.city}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-700/50">
                                    <div className="flex flex-col items-center text-center">
                                        <BedDouble className="w-5 h-5 text-slate-500 mb-1 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-300">{(asset as any).units || '-'}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Units</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center border-l border-slate-700/50">
                                        <Bath className="w-5 h-5 text-slate-500 mb-1 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-300">{(asset as any).floors || '-'}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Floors</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center border-l border-slate-700/50">
                                        <Square className="w-5 h-5 text-slate-500 mb-1 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-sm font-semibold text-slate-300">{(asset as any).buildingSize || '-'}</span>
                                        <span className="text-[10px] text-slate-500 uppercase">Sq Ft</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Building2 } from 'lucide-react';
