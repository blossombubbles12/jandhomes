"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

import AIChat from "@/components/AIChat";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-auto p-8 bg-background">
                    {children}
                </main>
            </div>
            <AIChat />
        </div>
    );
}
