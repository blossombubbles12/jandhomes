"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export function PremiumFooter() {
    return (
        <footer className="bg-background pt-24 pb-12 border-t border-border">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="group">
                            <h3 className="text-3xl font-serif text-foreground mb-8">
                                Jand<span className="text-primary">.</span>
                            </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
                            Defining modern luxury in Lagos real estate. We build confidence through transparency, excellence, and visionary design.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram size={18} />} label="Instagram" />
                            <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
                            <SocialIcon icon={<Linkedin size={18} />} label="LinkedIn" />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-light">
                            <li><FooterLink href="/about">Our Story</FooterLink></li>
                            <li><FooterLink href="/services">Services</FooterLink></li>
                            <li><FooterLink href="/careers">Careers</FooterLink></li>
                            <li><FooterLink href="/contact">Contact</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Discovery</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-light">
                            <li><FooterLink href="/properties">All Properties</FooterLink></li>
                            <li><FooterLink href="/properties?type=residential">Residential</FooterLink></li>
                            <li><FooterLink href="/properties?type=commercial">Commercial</FooterLink></li>
                            <li><FooterLink href="/locations">Map Search</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-light">
                            <li className="flex items-center gap-3">
                                <MapPin size={16} className="text-primary" />
                                <span>Admiralty Way, Lekki, Lagos</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-primary" />
                                <span>+234 800 JAND HOMES</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-primary" />
                                <span>hello@jandhomes.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} Jand Home Properties. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                    <div>
                        <span>Designed with Precision in Lagos.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="w-10 h-10 rounded-full border border-input flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer shadow-sm">
            <span className="sr-only">{label}</span>
            {icon}
        </div>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-primary transition-colors duration-300 flex items-center group">
            <span className="w-0 h-[1px] bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
            {children}
        </Link>
    );
}
