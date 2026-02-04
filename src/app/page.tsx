import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { HeroSection } from "@/components/public/premium/HeroSection";
import { PropertyCard } from "@/components/public/premium/PropertyCard";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { PropertyMap } from "@/components/public/premium/PropertyMap";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Revalidate data every hour
export const revalidate = 3600;

async function getLatestAssets() {
  try {
    const latest = await db.select()
      .from(assets)
      .where(eq(assets.isDeleted, false))
      .orderBy(desc(assets.createdAt))
      .limit(4);
    return latest;
  } catch (error) {
    console.error('Failed to fetch latest assets:', error);
    return [];
  }
}

async function getAllAssets() {
  try {
    return await db.select().from(assets).where(eq(assets.isDeleted, false));
  } catch (error) {
    console.error('Failed to fetch all assets:', error);
    return [];
  }
}

export default async function Home() {
  const latestAssets = await getLatestAssets();
  const allAssets = await getAllAssets();

  // Map db assets to property card props
  const properties = latestAssets.map(asset => ({
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
      <HeroSection />

      {/* Trust / About Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-md shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"
                alt="Luxury Interior"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-card border border-border p-6 flex flex-col justify-center hidden lg:flex shadow-xl rounded-lg">
              <span className="text-4xl font-serif text-primary block mb-1">10+</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Years of<br />Excellence</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">About Jand Homes</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              Curating the finest properties in <span className="text-muted-foreground italic">Lagos.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
              We are not just selling houses; we are curating lifestyles. For over a decade, Jand Homes has been the bridge between discerning clients and Nigeria's most coveted real estate.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-foreground font-serif text-xl mb-2">Portfolio</h4>
                <p className="text-sm text-muted-foreground">A diverse collection of premium residences and commercial spaces.</p>
              </div>
              <div>
                <h4 className="text-foreground font-serif text-xl mb-2">Service</h4>
                <p className="text-sm text-muted-foreground">Unwavering commitment to transparency and client satisfaction.</p>
              </div>
            </div>
            <Button variant="link" className="text-foreground hover:text-primary p-0 h-auto text-sm uppercase tracking-widest group" asChild>
              <Link href="/about">
                Read Our Story <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Selected Works</span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Featured Listings</h2>
            </div>
            <Button variant="outline" className="hidden md:flex border-input hover:bg-primary hover:text-primary-foreground rounded-full px-8" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.length > 0 ? (
              properties.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} index={idx} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-20 bg-muted/20 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No properties available at the moment.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12 md:hidden">
            <Button variant="outline" className="border-input hover:bg-primary hover:text-primary-foreground rounded-full px-8 w-full" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Locations Preview - Real Map */}
      <section className="relative h-[700px] bg-background border-y border-border overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PropertyMap assets={allAssets} />
        </div>

        {/* Floating Content Card */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 lg:left-24 z-10 max-w-md w-full pointer-events-none">
          <div className="bg-background/95 backdrop-blur-2xl border border-border p-8 md:p-10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] pointer-events-auto transform hover:-translate-y-1 transition-transform duration-500">
            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Interactive Atlas</span>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 leading-tight">Lagos is our <span className="text-primary italic">Canvas.</span></h2>
            <p className="text-muted-foreground text-sm md:text-base mb-10 font-light leading-relaxed">
              From the serene waterfronts of Ikoyi to the vibrant energy of Victoria Island, explore properties in the most desirable locations.
            </p>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 h-14 text-xs font-bold tracking-[0.2em] transition-all duration-300 w-full shadow-lg shadow-primary/20" asChild>
              <Link href="/locations">EXPLORE ALL LOCATIONS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-serif text-primary mb-2">₦450B+</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Assets Managed</span>
            </div>
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-serif text-primary mb-2">1.2K+</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Happy Families</span>
            </div>
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-serif text-primary mb-2">15+</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Lagos Districts</span>
            </div>
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-serif text-primary mb-2">100%</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Secure Transactions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Jand Distinction</span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8">Why Discerning Clients <br /><span className="italic text-muted-foreground font-light">Choose Jand Homes.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 border border-primary/20 flex items-center justify-center rounded-xl bg-primary/5">
                <span className="text-primary font-serif">01</span>
              </div>
              <h3 className="text-2xl font-serif text-foreground">Curated Excellence</h3>
              <p className="text-muted-foreground font-light leading-relaxed">We don't just list properties; we handpick only the most exceptional residences that meet our stringent criteria for luxury and investment potential.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 border border-primary/20 flex items-center justify-center rounded-xl bg-primary/5">
                <span className="text-primary font-serif">02</span>
              </div>
              <h3 className="text-2xl font-serif text-foreground">Absolute Transparency</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Integrity is the heartbeat of our firm. Every transaction is handled with complete disclosure, ensuring peace of mind for buyers and sellers alike.</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 border border-primary/20 flex items-center justify-center rounded-xl bg-primary/5">
                <span className="text-primary font-serif">03</span>
              </div>
              <h3 className="text-2xl font-serif text-foreground">Local Intelligence</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Our deep-rooted presence in Lagos grants us access to off-market opportunities and localized insights that others simply cannot provide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-secondary/50 border-t border-border relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">Stay Informed.</h2>
            <p className="text-muted-foreground text-lg font-light mb-10 leading-relaxed">
              Join our exclusive mailing list to receive off-market listings, market reports, and private community invitations from Jand Homes Properties.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-background border border-input rounded-full px-8 py-4 focus:outline-none focus:border-primary transition-all text-sm font-light"
              />
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-10 py-4 h-auto text-xs font-bold tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                SUBSCRIBE
              </Button>
            </form>
            <p className="mt-6 text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
