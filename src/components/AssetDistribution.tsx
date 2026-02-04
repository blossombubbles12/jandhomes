"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AssetDistributionProps {
    data: { name: string, value: number }[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function AssetDistribution({ data }: AssetDistributionProps) {
    return (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm h-[400px]">
            <h3 className="text-lg font-semibold mb-6 text-white/90">Asset Value by Type</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                        tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderRadius: '12px',
                            border: '1px solid #1e293b',
                            padding: '12px'
                        }}
                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Total Value']}
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
