"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* Parallax Background Image */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background z-10" />
                <img
                    src="https://images.unsplash.com/photo-1600607687960-ce872e92b096?q=80&w=2670&auto=format&fit=crop"
                    alt="Jand Homes Luxury Estate"
                    className="w-full h-full object-cover scale-105"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs md:text-sm font-medium text-primary tracking-widest uppercase mb-6">
                        Lagos &bull; Nigeria
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 tracking-tight drop-shadow-lg"
                >
                    Exceptional Homes.<br />
                    <span className="text-white/80 italic">Timeless Investments.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light drop-shadow-md"
                >
                    Discover a curated portfolio of Lagos&apos;s most prestigious properties, designed for those who seek more than just a home.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="bg-primary text-white hover:bg-white hover:text-black rounded-full px-8 h-12 text-sm font-semibold tracking-wide w-full sm:w-auto shadow-xl"
                        asChild
                    >
                        <Link href="/properties">Explore Collection</Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white/40 text-white hover:bg-white hover:text-black rounded-full px-8 h-12 text-sm font-semibold tracking-wide w-full sm:w-auto backdrop-blur-md"
                        asChild
                    >
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown size={16} />
                </motion.div>
            </motion.div>
        </div>
    );
}
