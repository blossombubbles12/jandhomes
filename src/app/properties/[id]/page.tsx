import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import AssetMap from "@/components/AssetMap";
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Bed, Bath, Expand, MapPin, Calendar, Clock, ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const asset = await db.query.assets.findFirst({
        where: (assets, { eq, and }) => and(eq(assets.id, id), eq(assets.isDeleted, false))
    });

    if (!asset) return { title: "Property Not Found | Jand Homes Properties" };

    return {
        title: `${asset.name} | Jand Homes Properties`,
        description: asset.description || `Examine the details of ${asset.name} in ${asset.city}, Lagos. A premier luxury residence by Jand Homes Properties.`,
    };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate UUID format before querying to avoid DB errors
    if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        notFound();
    }

    // Fetch asset
    const asset = await db.query.assets.findFirst({
        where: (assets, { eq, and }) => and(eq(assets.id, id), eq(assets.isDeleted, false))
    });

    if (!asset) {
        notFound();
    }

    const price = Number(asset.currentValuation || 0);
    const media = (asset.media as any[]) || [];
    const mainImage = media[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop';

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            {/* Cinematic Hero Image */}
            <section className="relative h-[60vh] lg:h-[80vh] w-full overflow-hidden">
                <img
                    src={mainImage}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

                <div className="absolute top-32 left-6 lg:left-12 z-20">
                    <Link href="/properties" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm">
                        <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                </div>

                <div className="absolute bottom-12 left-6 lg:left-12 z-20 max-w-4xl">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg">
                            {asset.listingType}
                        </span>
                        <span className="bg-background/80 text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 backdrop-blur-md border border-border rounded-md shadow-lg">
                            {asset.type}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight drop-shadow-2xl">
                        {asset.name}
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 lg:py-24">
                <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Summary Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Asking Price</span>
                                <span className="text-2xl font-light text-foreground">{formatCurrency(price)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Living Space</span>
                                <span className="text-2xl font-light text-foreground">{asset.buildingSize || '—'} m²</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Bedrooms</span>
                                <div className="flex items-center gap-2">
                                    <Bed size={18} className="text-primary" />
                                    <span className="text-2xl font-light text-foreground">{asset.units || 4}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Bathrooms</span>
                                <div className="flex items-center gap-2">
                                    <Bath size={18} className="text-primary" />
                                    <span className="text-2xl font-light text-foreground">4</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif text-foreground">Overview</h2>
                            <div className="prose prose-invert max-w-none text-muted-foreground font-light leading-relaxed space-y-4">
                                <p>{asset.description || "An exceptional residence in one of Lagos's most prestigious enclaves. This property represents the height of modern luxury architectural design and refined aesthetics."}</p>
                                <p>Featuring expansive windows that flood the interiors with natural light, high-end stone finishes, and meticulous attention to detail at every turn. Perfect for both private relaxation and grand-scale entertaining.</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <MapPin size={18} className="text-primary" />
                                <span>{asset.address ? `${asset.address}, ` : ''}{asset.city}, {asset.state}</span>
                            </div>
                            {asset.latitude && asset.longitude ? (
                                <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                                    <AssetMap
                                        center={[Number(asset.longitude), Number(asset.latitude)]}
                                        name={asset.name}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-inner">
                                    <div className="w-full h-full flex items-center justify-center opacity-50 grayscale">
                                        <div className="text-center">
                                            <MapPin size={48} className="mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Location data not available</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gallery Preview (Remaining Images) */}
                        {media.length > 1 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-serif text-foreground">Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {media.slice(1, 7).map((img, i) => (
                                        <div key={i} className="aspect-square overflow-hidden rounded-lg group">
                                            <img
                                                src={img.url}
                                                alt={`${asset.name} - ${i + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Inquiry Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-foreground">Inquire Now</h3>
                                <p className="text-sm text-muted-foreground">Expert guidance for an exceptional home.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <input className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <input className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone Number</label>
                                    <input className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="+234" />
                                </div>
                            </div>

                            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-md shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                Request Private Viewing
                            </Button>

                            <div className="pt-6 border-t border-border flex items-center justify-center gap-6">
                                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    <Share2 size={16} /> Share
                                </button>
                                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    <Heart size={16} /> Save
                                </button>
                            </div>
                        </div>

                        {/* Trust markers */}
                        <div className="mt-8 px-4 space-y-4">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Verified Authenticity</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Secured Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    );
}
