import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Landmark, Key, Users, BadgeCheck, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Our Services | Jand Homes Properties",
    description: "Discover our comprehensive suite of luxury real estate services in Lagos, from asset management to private brokerage.",
};

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            {/* Header */}
            <div className="relative pt-48 pb-24 bg-slate-950 overflow-hidden border-b border-border">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1507679799987-c73774586594?q=80&w=2670&auto=format&fit=crop"
                        alt="Services"
                        className="w-full h-full object-cover opacity-30 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 drop-shadow-lg">Strategic <span className="text-primary italic">Excellence.</span></h1>
                        <p className="text-white/70 max-w-xl text-lg font-light leading-relaxed">
                            Comprehensive real estate solutions designed for professional investors and homeowners who demand precision, discretion, and absolute transparency.
                        </p>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Brokerage */}
                        <ServiceCard
                            icon={<Landmark className="text-primary" size={32} />}
                            title="Private Brokerage"
                            description="Discrete acquisition and divestment of Lagos's most prestigious off-market properties. We handle everything from identification to closing."
                        />
                        {/* Asset Management */}
                        <ServiceCard
                            icon={<ShieldCheck className="text-primary" size={32} />}
                            title="Asset Management"
                            description="Comprehensive management of your property portfolio to maximize ROI while maintaining the highest structural and aesthetic standards."
                        />
                        {/* Advisory */}
                        <ServiceCard
                            icon={<Users className="text-primary" size={32} />}
                            title="Investment Advisory"
                            description="Data-driven market analysis and district growth forecasting to guide your capital toward the most promising Lagos real estate opportunities."
                        />
                        {/* Property Verification */}
                        <ServiceCard
                            icon={<BadgeCheck className="text-primary" size={32} />}
                            title="Title Verification"
                            description="Rigorous legal and technical due diligence on all property titles to ensure your investment is built on legally sound foundations."
                        />
                        {/* Short-Let Management */}
                        <ServiceCard
                            icon={<Key className="text-primary" size={32} />}
                            title="Property Yield Optimization"
                            description="Transforming your residential assets into high-performance rental engines through professional short-let and long-term tenant management."
                        />
                        {/* Rapid Liquidation */}
                        <ServiceCard
                            icon={<Zap className="text-primary" size={32} />}
                            title="Rapid Liquidation"
                            description="Strategic marketing and network-based exposure to ensure your assets are liquidated quickly at premium market valuations."
                        />
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-secondary/20 border-y border-border">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mb-16">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Our Methodology</span>
                        <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8">How we work for <span className="italic text-muted-foreground">You.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <ProcessStep number="01" title="Consult" details="In-depth analysis of your financial goals and lifestyle requirements." />
                        <ProcessStep number="02" title="Identify" details="Curating a selection of properties that match your specific success metrics." />
                        <ProcessStep number="03" title="Verify" details="Exhaustive due diligence on structural and legal status of all assets." />
                        <ProcessStep number="04" title="Execute" details="Precision closing and long-term management of the acquired property." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-background">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8">Ready to elevate your <br /><span className="italic text-muted-foreground">Portfolio?</span></h2>
                    <Button size="lg" className="rounded-full bg-primary text-white hover:bg-emerald-700 px-12 h-14 font-bold tracking-widest text-xs shadow-xl shadow-primary/20" asChild>
                        <Link href="/contact">SCHEDULE A PRIVATE SESSION</Link>
                    </Button>
                </div>
            </section>

            <PremiumFooter />
        </main>
    );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="group p-10 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-8 border border-border group-hover:bg-primary/5 transition-colors">
                {icon}
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-4">{title}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">{description}</p>
        </div>
    );
}

function ProcessStep({ number, title, details }: { number: string; title: string; details: string }) {
    return (
        <div className="space-y-4">
            <span className="text-4xl font-serif text-primary/20 block mb-6">{number}</span>
            <h4 className="text-xl font-medium text-foreground">{title}</h4>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">{details}</p>
        </div>
    );
}
