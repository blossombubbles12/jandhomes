"use client";

import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import Image from "next/image"; // Can use optimized image

// Mock images for now if none provided
const defaultImages = [
    { src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", alt: "Exterior" },
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", alt: "Living Room" },
    { src: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", alt: "Kitchen" },
];

interface ImageGalleryProps {
    images?: { src: string, alt?: string }[];
}

export default function ImageGallery({ images = defaultImages }: ImageGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const slides = images.map(img => ({ src: img.src }));

    return (
        <div className="bg-slate-900/40 p-6 rounded-xl shadow-sm border border-slate-800 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 text-white/90">Gallery</h3>
            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="relative aspect-video cursor-pointer overflow-hidden rounded-lg group border border-slate-800"
                            onClick={() => { setIndex(i); setOpen(true); }}
                        >
                            <img
                                src={img.src}
                                alt={img.alt || `Gallery Image ${i + 1}`}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">View</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-800/20 rounded-lg border border-dashed border-slate-700">
                    <p className="text-slate-500 text-sm italic">No images uploaded for this asset.</p>
                </div>
            )}

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </div>
    );
}
