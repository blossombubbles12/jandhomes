"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AssetDistributionProps {
    data: { name: string, value: number }[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AssetDistribution({ data }: AssetDistributionProps) {
    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-[400px]">
            <h3 className="text-lg font-semibold mb-6 text-foreground/90 font-serif">Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderRadius: '12px',
                            border: '1px solid hsl(var(--border))',
                            padding: '12px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', fontSize: '12px' }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Value']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
