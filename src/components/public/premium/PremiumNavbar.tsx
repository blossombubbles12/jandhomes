"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/about" },
    { label: "Expertise", href: "/services" },
    { label: "Refined Living", href: "/properties" },
    { label: "Contact", href: "/contact" },
];

export function PremiumNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const textColorClass = scrolled ? "text-foreground" : "text-white";

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled
                        ? "bg-background/90 backdrop-blur-md border-b border-border py-4 shadow-sm"
                        : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group relative z-50">
                        <h1 className={cn("text-2xl md:text-3xl font-serif tracking-tight transition-colors", textColorClass)}>
                            Jand<span className="text-primary">.</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium hover:text-primary transition-colors tracking-wide uppercase relative group px-2 py-1",
                                    scrolled
                                        ? "text-foreground/80 hover:text-primary"
                                        : "text-white/90 hover:text-white drop-shadow-sm"
                                )}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-4 z-50">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        <Button
                            className="hidden md:flex rounded-full px-6 transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 border-none"
                            asChild
                        >
                            <Link href="/contact">
                                Schedule Visit <ArrowUpRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={cn("md:hidden hover:text-primary transition-colors", textColorClass)}
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-3xl font-serif text-foreground hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}

                        <div className="flex items-center gap-4 mt-4">
                            <ThemeToggle />
                            <span className="text-sm text-muted-foreground">Switch Theme</span>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full mt-8" asChild>
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                                    <Phone className="mr-2 w-4 h-4" /> Get in Touch
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
