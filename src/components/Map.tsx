"use client";

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
    className?: string;
}

export default function Map({ className }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [lng] = useState(-74.5);
    const [lat] = useState(40);
    const [zoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        if (!mapContainer.current) return;

        // Use a free style by default if no token is provided, or use the token if available
        // For now, using a standard OSM raster style fallback if no vector style is provided
        // Ideally, user should provide a style URL in .env or via props
        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE || 'https://demotiles.maplibre.org/style.json';

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    }, [lng, lat, zoom]);

    return (
        <div className={`relative w-full h-full min-h-[400px] ${className || ''}`}>
            <div ref={mapContainer} className="absolute inset-0" />
        </div>
    );
}
