"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialChartProps {
    data?: Record<string, string | number>[]; // Mock data for now
}

const mockData = [
    { name: 'Jan', value: 400000000 },
    { name: 'Feb', value: 405000000 },
    { name: 'Mar', value: 402000000 },
    { name: 'Apr', value: 410000000 },
    { name: 'May', value: 415000000 },
    { name: 'Jun', value: 420000000 },
];

export default function FinancialChart({ data = mockData }: FinancialChartProps) {
    return (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm h-[400px]">
            <h3 className="text-lg font-semibold mb-6 text-white/90">Asset Value Appreciation</h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
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
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            padding: '12px'
                        }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Portfolio Value']}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
