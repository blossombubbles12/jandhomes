import { db } from '@/lib/db';
import { assets, auditLogs } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AssetSummary from '@/components/AssetSummary';
import FinancialChart from '@/components/FinancialChart';
import ImageGallery from '@/components/ImageGallery';
import AssetMap from '@/components/AssetMap';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, ChevronLeft, FileText, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminAssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        notFound();
    }

    const [asset] = await db.select().from(assets).where(eq(assets.id, id));

    if (!asset || asset.isDeleted) {
        notFound();
    }

    // Fetch Recent Activity (Audit Logs)
    const activities = await db.select()
        .from(auditLogs)
        .where(
            and(
                eq(auditLogs.entityId, id),
                eq(auditLogs.entityType, 'ASSET')
            )
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(5);

    const parseJSON = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    };

    const mediaItems = parseJSON(asset.media);
    const attachmentItems = parseJSON(asset.attachments);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/assets"><ChevronLeft className="h-5 w-5" /></Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{asset.name}</h2>
                        <p className="text-muted-foreground">{asset.address}, {asset.city}</p>
                    </div>
                </div>
                <Button variant="premium" asChild className="hidden sm:flex">
                    <Link href={`/admin/assets/${id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Asset
                    </Link>
                </Button>
            </div>

            <div className="space-y-8">
                {/* Top Summary Section */}
                <AssetSummary asset={asset} />

                {/* Visuals & Data Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Visuals */}
                    <div className="space-y-8">
                        <ImageGallery
                            images={mediaItems.length > 0
                                ? mediaItems.filter((m: any) => m.type === 'image').map((m: any) => ({ src: m.url, alt: m.name }))
                                : undefined
                            }
                        />

                        {/* Attachments Section */}
                        {attachmentItems.length > 0 && (
                            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                                <h3 className="text-lg font-semibold mb-4 text-foreground">Documents & Files</h3>
                                <div className="space-y-3">
                                    {(attachmentItems as any[]).map((file: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                    <p className="text-[10px] uppercase text-muted-foreground font-bold">{file.type}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 border border-border/50">
                                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                </a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Analytics */}
                    <div className="space-y-8">
                        <FinancialChart />

                        {/* Recent Activity Table using data from audit logs */}
                        <div className="bg-card p-6 rounded-xl shadow-sm border border-border min-h-[300px]">
                            <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
                                <Clock size={20} className="text-primary" />
                                Recent Activity
                            </h3>
                            <div className="space-y-6">
                                {activities.length > 0 ? (
                                    activities.map((log) => (
                                        <div key={log.id} className="flex items-start space-x-3 text-sm group">
                                            <div className={cn(
                                                "w-2 h-2 mt-1.5 rounded-full ring-4 ring-offset-0 transition-all group-hover:scale-125",
                                                log.action === 'CREATE' ? "bg-emerald-500 ring-emerald-500/20" :
                                                    log.action === 'UPDATE' ? "bg-blue-500 ring-blue-500/20" :
                                                        "bg-rose-500 ring-rose-500/20"
                                            )} />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-semibold text-foreground">
                                                        {log.action === 'CREATE' ? 'Asset Created' :
                                                            log.action === 'UPDATE' ? 'Asset Updated' :
                                                                log.action === 'DELETE' ? 'Asset Deleted' : log.action}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                        {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }) : 'N/A'}
                                                    </p>
                                                </div>
                                                <p className="text-muted-foreground text-xs mt-1">
                                                    {log.action === 'UPDATE' && log.details
                                                        ? `Changes made to property fields.`
                                                        : log.action === 'CREATE'
                                                            ? 'Asset formally registered into the system.'
                                                            : 'No additional details recorded.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                        <Clock size={40} className="mb-2 opacity-20" />
                                        <p className="text-sm italic">No recent activity recorded.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Location Map */}
            <div className="w-full">
                <AssetMap
                    center={asset.latitude && asset.longitude ? [Number(asset.longitude), Number(asset.latitude)] : undefined}
                    name={asset.name}
                />
            </div>
        </div>
    );
}
