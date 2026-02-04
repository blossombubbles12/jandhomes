"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Asset } from '@/lib/schema';

interface DashboardMapProps {
    assets: Asset[];
}

export default function DashboardMap({ assets }: DashboardMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoading, setMapLoading] = React.useState(true);
    const [resizeKey, setResizeKey] = React.useState(0);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) {
            console.error('Map container ref is null');
            return;
        }

        setMapLoading(true);
        console.log('Map container attached, initializing...');

        const center: [number, number] = [3.5134, 6.4621];
        console.log('Centering map on Lagos:', center);

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/dark',
            center: center,
            zoom: 11
        });

        map.current = mapInstance;
        mapInstance.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        // Safety timeout to hide loading even if map load event is delayed
        const timer = setTimeout(() => setMapLoading(false), 5000);

        mapInstance.on('styledata', () => {
            console.log('Map style data updated');
        });

        mapInstance.on('load', () => {
            clearTimeout(timer);
            setMapLoading(false);
            console.log('Map loaded successfully');

            // Ensure map fits the container
            mapInstance.resize();
            setTimeout(() => mapInstance.resize(), 100);
            // 1. Convert assets to GeoJSON
            const features = assets.reduce<GeoJSON.Feature<GeoJSON.Point>[]>((acc, asset) => {
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
                            value: asset.currentValuation
                        }
                    });
                }
                return acc;
            }, []);

            const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
                type: 'FeatureCollection',
                features: features
            };

            console.log('Adding', features.length, 'features to the map');

            // 2. Add Source with clustering
            mapInstance.addSource('assets', {
                type: 'geojson',
                data: geoJsonData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            // 3. Add Layers
            // Clusters
            mapInstance.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'assets',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });

            // Cluster Counts
            mapInstance.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'assets',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-size': 14
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });

            // Unclustered Points
            mapInstance.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'assets',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#10b981', // Emerald 500
                    'circle-radius': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        12,
                        8
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                }
            });

            // 4. Interactivity
            mapInstance.on('click', 'clusters', async (e) => {
                const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                const clusterId = features[0].properties.cluster_id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const source: any = mapInstance.getSource('assets');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                    if (err) return;
                    mapInstance.easeTo({
                        center: (features[0].geometry as any).coordinates,
                        zoom: zoom
                    });
                });
            });

            mapInstance.on('click', 'unclustered-point', (e) => {
                const coordinates = (e.features![0].geometry as any).coordinates.slice();
                const props = e.features![0].properties;

                // Cinematic Flythrough Effect
                mapInstance.flyTo({
                    center: coordinates,
                    zoom: 17,
                    pitch: 60,
                    bearing: -20,
                    duration: 2000,
                    essential: true
                });

                new maplibregl.Popup({ className: 'premium-map-popup', offset: 15 })
                    .setLngLat(coordinates)
                    .setHTML(`
                        <div class="p-3">
                            <h4 class="font-bold text-slate-900 mb-1 leading-tight">${props.name}</h4>
                            <p class="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Verified Asset</p>
                            <p class="text-sm text-emerald-600 mb-3 font-mono font-bold tracking-tighter">₦${Number(props.value).toLocaleString()}</p>
                            <a href="/admin/assets/${props.id}" class="block text-center bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all border border-slate-700 shadow-lg">
                                Examine Property Details
                            </a>
                        </div>
                    `)
                    .addTo(mapInstance);
            });

            // Hover effects for unclustered points
            let hoveredId: string | null = null;
            const tooltip = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'hover-tooltip',
                offset: 10
            });

            mapInstance.on('mouseenter', 'unclustered-point', (e) => {
                if (e.features!.length > 0) {
                    mapInstance.getCanvas().style.cursor = 'pointer';

                    if (hoveredId) {
                        mapInstance.setFeatureState(
                            { source: 'assets', id: hoveredId },
                            { hover: false }
                        );
                    }

                    hoveredId = e.features![0].id as string;
                    mapInstance.setFeatureState(
                        { source: 'assets', id: hoveredId },
                        { hover: true }
                    );

                    const coordinates = (e.features![0].geometry as any).coordinates.slice();
                    const props = e.features![0].properties;

                    tooltip.setLngLat(coordinates)
                        .setHTML(`<div class="px-2 py-1 font-semibold text-xs text-white">${props.name}</div>`)
                        .addTo(mapInstance);
                }
            });

            mapInstance.on('mouseleave', 'unclustered-point', () => {
                mapInstance.getCanvas().style.cursor = '';
                if (hoveredId) {
                    mapInstance.setFeatureState(
                        { source: 'assets', id: hoveredId },
                        { hover: false }
                    );
                }
                hoveredId = null;
                tooltip.remove();
            });

            mapInstance.on('mouseenter', 'clusters', () => {
                mapInstance.getCanvas().style.cursor = 'pointer';
            });
            mapInstance.on('mouseleave', 'clusters', () => {
                mapInstance.getCanvas().style.cursor = '';
            });

            console.log('All map layers and handlers added successfully');
        });

        mapInstance.on('error', (e) => {
            console.error('Map error:', e);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [assets]); // Re-run if assets change drastically, though usually cleaner to update source data

    return (
        <div
            className="bg-slate-900 rounded-xl overflow-hidden h-full w-full relative border-2 border-slate-700 shadow-inner"
            style={{ minHeight: '500px' }}
        >
            {mapLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-slate-200 font-semibold">Loading Portfolio Map</p>
                            <p className="text-slate-500 text-xs mt-1">Connecting to geospatial servers...</p>
                        </div>
                    </div>
                </div>
            )}
            <div
                ref={mapContainer}
                className="absolute inset-0 z-10"
                style={{ width: '100%', height: '100%' }}
            />
            {/* Fallback pattern to show the container is active */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
    );
}
