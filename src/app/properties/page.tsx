import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { PropertyCard } from '@/components/public/premium/PropertyCard';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio | Jand Homes Properties",
    description: "Explore our exclusive collection of luxury properties and premium real estate investments in Lagos, Nigeria.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function PropertiesPage() {
    const allAssets = await db.select().from(assets);

    const properties = allAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        location: asset.city || "Lagos",
        price: Number(asset.currentValuation || 0),
        featuredImage: (asset.media as any[])?.[0]?.url || null,
        beds: asset.units || 4,
        baths: 4,
        sqft: Number(asset.buildingSize || 0)
    }));

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            {/* Header */}
            <div className="relative pt-48 pb-24 bg-slate-950 overflow-hidden border-b border-border">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop"
                        alt="Architecture"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div>
                        <h1 className="font-serif text-5xl md:text-6xl text-white mb-4 drop-shadow-lg">Our Portfolio</h1>
                        <p className="text-white/70 max-w-xl text-lg font-light leading-relaxed">
                            A curated selection of Lagos's most prestigious residences, each a testament to luxury, comfort, and uncompromising design.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="container mx-auto px-6 py-12">
                {/* Filters Placeholder */}
                <div className="mb-12 flex flex-wrap gap-4">
                    <div className="px-4 py-2 border border-input rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                        All Locations
                    </div>
                    <div className="px-4 py-2 border border-input rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                        Property Type
                    </div>
                    <div className="px-4 py-2 border border-input rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors">
                        Price Range
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((prop, idx) => (
                        <PropertyCard key={prop.id} property={prop} index={idx} />
                    ))}
                </div>

                {properties.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No properties found matching your criteria.</p>
                    </div>
                )}
            </div>

            <PremiumFooter />
        </main>
    );
}
