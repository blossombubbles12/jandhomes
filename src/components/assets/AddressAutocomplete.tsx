"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Suggestion {
    name: string;
    city?: string;
    state?: string;
    country?: string;
    lat: string;
    lon: string;
    fullAddress: string;
}

interface AddressAutocompleteProps {
    onSelect: (suggestion: Suggestion) => void;
    defaultValue?: string;
}

export function AddressAutocomplete({ onSelect, defaultValue = "" }: AddressAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                // Using Photon (OpenStreetMap based) for free geocoding
                const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();

                const results = data.features.map((f: any) => {
                    const p = f.properties;
                    const parts = [p.name, p.street, p.district, p.city, p.state, p.country].filter(Boolean);
                    return {
                        name: p.name || p.street || "",
                        city: p.city || p.town || "",
                        state: p.state || "",
                        country: p.country || "",
                        lat: f.geometry.coordinates[1].toString(),
                        lon: f.geometry.coordinates[0].toString(),
                        fullAddress: parts.join(", ")
                    };
                });

                setSuggestions(results);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Geocoding error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search address (e.g. Ajah, Lagos)..."
                    className="pl-9 bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
                    onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-emerald-500" />
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-start gap-3 border-b border-slate-800 last:border-0"
                            onClick={() => {
                                setQuery(s.fullAddress);
                                onSelect(s);
                                setShowSuggestions(false);
                            }}
                        >
                            <MapPin className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-white">{s.fullAddress}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                                    Lat: {parseFloat(s.lat).toFixed(4)} | Lon: {parseFloat(s.lon).toFixed(4)}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
