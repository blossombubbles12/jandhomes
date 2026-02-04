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
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-[400px]">
            <h3 className="text-lg font-semibold mb-6 text-foreground/90 font-serif">Valuation Growth</h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
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
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Value']}
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
