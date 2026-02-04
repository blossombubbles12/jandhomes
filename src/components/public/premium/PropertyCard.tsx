"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bed, Bath, Expand } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PropertyProps {
    id: string;
    name: string;
    location: string;
    price: number;
    featuredImage: string;
    beds: number;
    baths: number;
    sqft: number;
    slug?: string;
}

export function PropertyCard({ property, index = 0 }: { property: PropertyProps; index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative flex flex-col h-full bg-card border border-border overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Link href={`/properties/${property.id}`} className="block w-full h-full">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                        src={property.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'}
                        alt={property.name}
                        className="w-full h-full object-cover"
                    />
                </Link>
                <div className="absolute top-4 left-4 z-20">
                    <span className="bg-background/90 text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 backdrop-blur-md border border-border rounded-md shadow-sm">
                        For Sale
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="mb-4">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                        {property.location}
                    </p>
                    <Link href={`/properties/${property.id}`}>
                        <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                            {property.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <Bed size={14} className="text-primary" />
                            <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bath size={14} className="text-primary" />
                            <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5 hidden sm:flex">
                            <Expand size={14} className="text-primary" />
                            <span>{property.sqft} m²</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-light text-foreground tracking-tight">
                        {formatCurrency(property.price)}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full border border-input text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                        asChild
                    >
                        <Link href={`/properties/${property.id}`}>
                            <ArrowUpRight size={18} />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
