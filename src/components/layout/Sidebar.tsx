"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Map as MapIcon,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    PieChart,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Building2, label: 'Assets', href: '/admin/assets' },
    { icon: MapIcon, label: 'Map View', href: '/admin/map' },
    { icon: PieChart, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    role: string;
}

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/user/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        if (user.name) {
            const parts = user.name.split(' ');
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        return user.email.substring(0, 2).toUpperCase();
    };

    const getDisplayName = () => {
        if (!user) return 'Loading...';
        return user.name || user.email.split('@')[0];
    };

    const SidebarContent = ({ isMobile = false }) => (
        <>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {(!collapsed || isMobile) && (
                    <span className="font-serif font-bold text-2xl tracking-tight text-foreground">
                        Jand<span className="text-primary">.</span>
                    </span>
                )}
                {!isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </Button>
                )}
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(false)}
                        className="ml-auto"
                    >
                        <X size={20} />
                    </Button>
                )}
            </div>

            {/* Menu */}
            <div className="flex-1 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group relative",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} className={cn("min-h-[20px] min-w-[20px]", isActive ? "text-primary" : "text-muted-foreground")} />
                            {(!collapsed || isMobile) && (
                                <span className="ml-3 font-medium text-sm truncate">
                                    {item.label}
                                </span>
                            )}
                            {isActive && (!collapsed || isMobile) && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border mt-auto">
                <Button variant="ghost" className={cn("w-full justify-start", (collapsed && !isMobile) ? "px-2" : "")} asChild>
                    <a href="/api/auth/signout">
                        <LogOut size={20} className="text-red-500" />
                        {(!collapsed || isMobile) && <span className="ml-3 text-red-500">Sign Out</span>}
                    </a>
                </Button>

                {(!collapsed || isMobile) && (
                    <div className="mt-4 flex items-center justify-between px-2">
                        <div className="flex items-center overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center border border-primary/30">
                                <span className="text-xs font-bold text-primary">
                                    {getUserInitials()}
                                </span>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate text-foreground">
                                    {getDisplayName()}
                                </p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Toggle Button - Fixed on screen when menu closed */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                {!mobileOpen && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-background shadow-md border-border"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={20} />
                    </Button>
                )}
            </div>

            {/* Mobile Overlay & Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border z-50 flex flex-col md:hidden shadow-2xl"
                        >
                            <SidebarContent isMobile={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                initial={{ width: 240 }}
                animate={{ width: collapsed ? 80 : 240 }}
                className="hidden md:flex h-screen bg-card border-r border-border flex-col sticky top-0 z-40"
            >
                <SidebarContent />
            </motion.div>
        </>
    );
}
