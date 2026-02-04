"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Asset } from '@/lib/schema';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface PropertyMapProps {
    assets: Asset[];
    className?: string;
}

export function PropertyMap({ assets, className }: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [webGlSupported, setWebGlSupported] = useState(true);
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check for WebGL support
        try {
            const canvas = document.createElement('canvas');
            const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            setWebGlSupported(support);
        } catch (e) {
            setWebGlSupported(false);
        }
    }, []);

    useEffect(() => {
        if (!mounted || !mapContainer.current || !webGlSupported) return;

        let mapInstance: maplibregl.Map | null = null;
        let isDestroyed = false;

        const initMap = () => {
            if (isDestroyed) return;

            // Cleanup previous
            if (map.current) {
                map.current.remove();
                map.current = null;
            }

            const currentTheme = resolvedTheme || theme;
            const center: [number, number] = [3.5134, 6.4621];

            // Use requestAnimationFrame to ensure container is fully dimensioned
            requestAnimationFrame(() => {
                if (isDestroyed || !mapContainer.current) return;

                mapInstance = new maplibregl.Map({
                    container: mapContainer.current,
                    style: currentTheme === 'light'
                        ? 'https://tiles.openfreemap.org/styles/bright'
                        : 'https://tiles.openfreemap.org/styles/dark',
                    center: center,
                    zoom: 11,
                    attributionControl: false
                });

                map.current = mapInstance;
                mapInstance.addControl(new maplibregl.NavigationControl(), 'bottom-right');

                mapInstance.on('load', () => {
                    if (isDestroyed) return;
                    setMapLoading(false);

                    // Aggressive resize sequence for robust rendering
                    const resize = () => {
                        if (mapInstance && !isDestroyed) mapInstance.resize();
                    };

                    resize();
                    const timeouts = [100, 500, 1000, 2000];
                    timeouts.forEach(ms => setTimeout(resize, ms));

                    // Setup Source & Layers
                    const features = assets.reduce<any[]>((acc, asset) => {
                        if (asset.latitude && asset.longitude) {
                            acc.push({
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [Number(asset.longitude), Number(asset.latitude)]
                                },
                                properties: {
                                    id: asset.id,
                                    name: asset.name,
                                    price: asset.currentValuation,
                                    location: asset.city
                                }
                            });
                        }
                        return acc;
                    }, []);

                    mapInstance.addSource('properties', {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features },
                        cluster: true,
                        clusterMaxZoom: 14,
                        clusterRadius: 50
                    });

                    // Layers (Simplified/Robust)
                    mapInstance.addLayer({
                        id: 'clusters',
                        type: 'circle',
                        source: 'properties',
                        filter: ['has', 'point_count'],
                        paint: {
                            'circle-color': '#10b981',
                            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                            'circle-opacity': 0.8
                        }
                    });

                    mapInstance.addLayer({
                        id: 'cluster-count',
                        type: 'symbol',
                        source: 'properties',
                        filter: ['has', 'point_count'],
                        layout: {
                            'text-field': ['get', 'point_count_abbreviated'],
                            'text-size': 12
                        },
                        paint: { 'text-color': '#ffffff' }
                    });

                    mapInstance.addLayer({
                        id: 'property-points',
                        type: 'circle',
                        source: 'properties',
                        filter: ['!', ['has', 'point_count']],
                        paint: {
                            'circle-color': '#10b981',
                            'circle-radius': 8,
                            'circle-stroke-width': 3,
                            'circle-stroke-color': '#ffffff'
                        }
                    });

                    // Fit Bounds
                    if (features.length > 0) {
                        const bounds = new maplibregl.LngLatBounds();
                        features.forEach(f => bounds.extend(f.geometry.coordinates as [number, number]));
                        mapInstance.fitBounds(bounds, { padding: 50, maxZoom: 15 });
                    }

                    // Handlers
                    mapInstance.on('click', 'property-points', (e) => {
                        const feature = e.features?.[0];
                        if (!feature) return;

                        const coordinates = (feature.geometry as any).coordinates.slice();
                        const { id, name, price, location } = feature.properties as any;

                        new maplibregl.Popup({ offset: 15, className: 'public-map-popup' })
                            .setLngLat(coordinates)
                            .setHTML(`
                                <div class="p-4 min-w-[200px] font-sans">
                                    <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-1">${location || 'Lagos'}</p>
                                    <h4 class="font-serif text-lg text-slate-900 mb-2 leading-tight">${name}</h4>
                                    <p class="text-sm font-light text-slate-700 mb-4">${formatCurrency(price)}</p>
                                    <a href="/properties/${id}" class="inline-block w-full text-center bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold py-2 rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
                                        View Residence
                                    </a>
                                </div>
                            `)
                            .addTo(mapInstance!);
                    });

                    mapInstance.on('mouseenter', 'property-points', () => mapInstance!.getCanvas().style.cursor = 'pointer');
                    mapInstance.on('mouseleave', 'property-points', () => mapInstance!.getCanvas().style.cursor = '');
                });
            });
        };

        // Use IntersectionObserver to wait until the map section is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                initMap();
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        observer.observe(mapContainer.current);

        return () => {
            isDestroyed = true;
            observer.disconnect();
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [assets, mounted, theme, resolvedTheme, webGlSupported]);

    if (!mounted) return null;

    if (!webGlSupported) {
        return (
            <div className={`relative w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center ${className || ''}`}>
                <div className="text-center p-8">
                    <p className="text-slate-500 mb-2">WebGL not supported in this browser.</p>
                    <p className="text-xs text-slate-400">Please try a modern browser to view the interactive map.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full bg-slate-100 dark:bg-slate-900 ${className || ''}`} style={{ minHeight: '300px', display: 'block' }}>
            {mapLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-sm pointer-events-none">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Establishing Map Connection</span>
                    </div>
                </div>
            )}

            {/* Forced visibility: no visibility:hidden or display:none */}
            <div
                ref={mapContainer}
                className="absolute inset-0 z-0 w-full h-full"
                style={{ background: '#0f172a' }} // Dark fallback background
            />

            <style jsx global>{`
                .public-map-popup .maplibregl-popup-content {
                    padding: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .public-map-popup .maplibregl-popup-close-button {
                    padding: 5px 8px;
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}
