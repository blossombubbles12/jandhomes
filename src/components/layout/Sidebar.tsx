"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Map as MapIcon,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    PieChart
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
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        fetchUserProfile();
    }, []);

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

    return (
        <motion.div
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 80 : 240 }}
            className="h-screen bg-card border-r border-border flex flex-col sticky top-0 z-40"
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {!collapsed && (
                    <span className="font-serif font-bold text-2xl tracking-tight text-foreground">
                        Jand<span className="text-primary">.</span>
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            {/* Menu */}
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} className={cn("min-h-[20px] min-w-[20px]", isActive ? "text-primary" : "text-muted-foreground")} />
                            {!collapsed && (
                                <span className="ml-3 font-medium text-sm truncate">
                                    {item.label}
                                </span>
                            )}
                            {isActive && !collapsed && (
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
                <Button variant="ghost" className={cn("w-full justify-start", collapsed ? "px-2" : "")} asChild>
                    <a href="/api/auth/signout">
                        <LogOut size={20} className="text-red-500" />
                        {!collapsed && <span className="ml-3 text-red-500">Sign Out</span>}
                    </a>
                </Button>

                {!collapsed && (
                    <div className="mt-4 flex items-center justify-between px-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
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
        </motion.div>
    );
}
