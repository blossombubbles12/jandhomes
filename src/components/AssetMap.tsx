"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { MapPinOff } from 'lucide-react';

interface AssetMapProps {
    center?: [number, number];
    name?: string;
}

export default function AssetMap({ center, name = "Property Location" }: AssetMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoading, setMapLoading] = useState(true);

    const { theme } = useTheme();

    // If no center provided, show fallback UI
    if (!center || (center[0] === 0 && center[1] === 0)) {
        return (
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-[500px]">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Location Overview</h3>
                <div className="w-full h-[calc(100%-2rem)] rounded-lg overflow-hidden relative border border-border flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                    <MapPinOff size={48} className="mb-4 opacity-50" />
                    <p className="text-sm font-medium">Location data not available</p>
                    <p className="text-xs mt-1">Add latitude and longitude to view map</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (map.current) {
            map.current.setStyle(theme === 'dark'
                ? 'https://tiles.openfreemap.org/styles/dark'
                : 'https://tiles.openfreemap.org/styles/bright'
            );
            return;
        }
        if (!mapContainer.current) {
            console.error('Map container ref is null');
            return;
        }

        // Valid center check
        if (isNaN(center[0]) || isNaN(center[1])) {
            console.error('Invalid center coordinates:', center);
            return;
        }

        setMapLoading(true);
        console.log('Initializing AssetMap for coordinates:', center);

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: theme === 'dark'
                ? 'https://tiles.openfreemap.org/styles/dark'
                : 'https://tiles.openfreemap.org/styles/bright',
            center: center,
            zoom: 13,
            pitch: 0,
            interactive: true,
            attributionControl: false
        });

        map.current = mapInstance;
        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Safety timeout to hide loading even if load event is delayed
        const timer = setTimeout(() => setMapLoading(false), 3000);

        mapInstance.on('styledata', () => {
            console.log('AssetMap style data updated');
        });

        mapInstance.on('load', () => {
            clearTimeout(timer);
            setMapLoading(false);
            console.log('AssetMap loaded successfully');

            // CRITICAL: Ensure map fits the container (aggressive resize sequence)
            const resize = () => {
                if (mapInstance) mapInstance.resize();
            };
            resize();
            const timeouts = [100, 500, 1000, 2000];
            timeouts.forEach(ms => setTimeout(resize, ms));

            // Add Premium Marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '32px';
            el.style.height = '32px';
            el.style.backgroundColor = '#10b981';
            el.style.borderRadius = '50%';
            el.style.border = '4px solid #fff';
            el.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.8)';
            el.style.cursor = 'pointer';

            new maplibregl.Marker({ element: el })
                .setLngLat(center)
                .setPopup(new maplibregl.Popup({ offset: 25, closeButton: false })
                    .setHTML(`
                    <div style="padding: 12px; font-family: inherit; min-width: 180px;">
                        <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 4px; font-size: 14px;">${name}</h4>
                        <p style="font-size: 11px; color: #64748b; margin: 0;">Verified Asset Location</p>
                    </div>
                `))
                .addTo(mapInstance);

            // Cinematic fly-to animation
            setTimeout(() => {
                mapInstance.flyTo({
                    center: center,
                    zoom: 16,
                    pitch: 60,
                    bearing: 15,
                    speed: 0.7,
                    curve: 1.4,
                    easing: (t) => t
                });
            }, 800);
        });

        mapInstance.on('error', (e) => {
            console.error('AssetMap error:', e);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [center, name, theme]);

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Location Overview</h3>

            {/* Map Container - Mirroring DashboardMap structure exactly */}
            <div
                className="bg-muted rounded-xl overflow-hidden relative border border-border shadow-inner"
                style={{ minHeight: '500px', height: '500px' }}
            >
                {mapLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                            <div className="text-center">
                                <p className="text-foreground font-semibold">Loading Asset Map</p>
                                <p className="text-muted-foreground text-xs mt-1">Connecting to geospatial servers...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Map container - ALWAYS rendered, matching DashboardMap */}
                <div
                    ref={mapContainer}
                    className="absolute inset-0 z-10"
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Fallback pattern to show the container is active */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
        </div>
    );
}
