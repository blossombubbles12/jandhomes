"use client";

import React, { useState, useMemo } from "react";
import { Asset } from "@/lib/schema";
import { PropertyMap } from "@/components/public/premium/PropertyMap";
import { PropertyCard } from "@/components/public/premium/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Map as MapIcon, List, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface MapSearchContainerProps {
    initialAssets: Asset[];
}

export function MapSearchContainer({ initialAssets }: MapSearchContainerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("All");
    const [viewMode, setViewMode] = useState<"map" | "list" | "split">("split");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter logic
    const filteredAssets = useMemo(() => {
        return initialAssets.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.city?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === "All" || asset.type === selectedType;
            return matchesSearch && matchesType && !asset.isDeleted;
        });
    }, [initialAssets, searchQuery, selectedType]);

    // Format for PropertyCard props
    const propertyCardsData = useMemo(() => {
        return filteredAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            location: asset.city || "Lagos",
            price: Number(asset.currentValuation || 0),
            featuredImage: (asset.media as any[])?.[0]?.url || null,
            beds: asset.units || 4,
            baths: 4,
            sqft: Number(asset.buildingSize || 0)
        }));
    }, [filteredAssets]);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            {/* Top Toolbar */}
            <div className="bg-background border-b border-border px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-30 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder="Address, City, or Residence Name..."
                            className="pl-10 h-11 rounded-full border-muted bg-secondary/20 focus-visible:ring-primary/20 focus:border-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("rounded-full transition-all duration-300", isFilterOpen && "bg-primary/10 border-primary text-primary")}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <SlidersHorizontal size={18} />
                    </Button>
                </div>

                <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-full border border-border">
                    <button
                        onClick={() => setViewMode("map")}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 transition-all duration-300",
                            viewMode === "map" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <MapIcon size={14} /> MAP
                    </button>
                    <button
                        onClick={() => setViewMode("split")}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold tracking-widest hidden md:flex items-center gap-2 transition-all duration-300",
                            viewMode === "split" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        SPLIT
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 transition-all duration-300",
                            viewMode === "list" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <List size={14} /> LIST
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Side Panel (List) */}
                <div className={cn(
                    "bg-background transition-all duration-500 overflow-y-auto border-r border-border custom-scrollbar",
                    viewMode === "map" ? "w-0 opacity-0" : viewMode === "list" ? "w-full" : "w-full md:w-[450px] lg:w-[550px]"
                )}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-serif text-2xl text-foreground">
                                {filteredAssets.length} <span className="text-muted-foreground italic">results found.</span>
                            </h2>
                        </div>

                        <div className={cn(
                            "grid gap-6",
                            viewMode === "list" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-1 lg:grid-cols-2"
                        )}>
                            {propertyCardsData.map((prop, idx) => (
                                <PropertyCard key={prop.id} property={prop} index={idx} />
                            ))}
                        </div>

                        {filteredAssets.length === 0 && (
                            <div className="py-24 text-center">
                                <MapIcon className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                                <h3 className="text-xl font-serif text-foreground mb-2">No properties matched.</h3>
                                <p className="text-muted-foreground font-light">Try expanding your search area or adjusting the filters.</p>
                                <Button variant="link" className="mt-4 text-primary" onClick={() => { setSearchQuery(""); setSelectedType("All") }}>Clear all filters</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Area */}
                <div className={cn(
                    "flex-1 relative transition-all duration-500",
                    viewMode === "list" ? "hidden" : "block"
                )}>
                    <PropertyMap assets={filteredAssets} />

                    {/* Floating Overlay for Map only view */}
                    {viewMode === "map" && (
                        <div className="absolute top-4 left-4 z-20 md:hidden">
                            <Button size="sm" className="bg-background text-foreground rounded-full shadow-lg" onClick={() => setViewMode("split")}>
                                <List size={16} className="mr-2" /> Show List
                            </Button>
                        </div>
                    )}
                </div>

                {/* Extended Filters Sidebar */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-border z-40 shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="font-serif text-xl">Refine Search</h3>
                                <button onClick={() => setIsFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8 flex-1">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 block">Property Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["All", "Residential", "Commercial", "Land"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    "px-3 py-2 rounded-md text-xs border transition-all duration-300",
                                                    selectedType === type ? "bg-primary border-primary text-white" : "border-border hover:border-primary/50 text-muted-foreground"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 block">District Focus</label>
                                    <select className="w-full bg-secondary/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30">
                                        <option>All Lagos Districts</option>
                                        <option>Ikoyi</option>
                                        <option>Victoria Island</option>
                                        <option>Lekki Phase 1</option>
                                        <option>Banana Island</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 block">Status</label>
                                    <div className="space-y-2">
                                        {["Available", "Off-Market Preview"].map((status) => (
                                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="w-4 h-4 rounded border border-border group-hover:border-primary/50 transition-colors" />
                                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 rounded-full h-12 text-xs font-bold tracking-widest uppercase shadow-lg shadow-emerald-500/20" onClick={() => setIsFilterOpen(false)}>
                                    Update Map
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
}
