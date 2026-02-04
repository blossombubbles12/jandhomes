import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "About Us | Jand Homes Properties",
    description: "Learn about Jand Homes Properties, Lagos's premier real estate firm dedicated to excellence, transparency, and luxury living.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            {/* Hero / Page Header */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"
                        alt="Exceptional Architecture"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div>
                        <h1 className="font-serif text-5xl md:text-8xl text-white mb-8 leading-[1.1] drop-shadow-2xl">
                            The Jand <br />
                            <span className="text-primary italic">Standard.</span>
                        </h1>
                        <div className="max-w-2xl border-l-2 border-primary pl-8">
                            <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed">
                                Curating architectural excellence and timeless legacies in the heart of Lagos since 2012.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="font-serif text-3xl md:text-4xl text-foreground">Our Story</h2>
                        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-light">
                            <p>
                                Founded with a vision to elevate the real estate standard in Nigeria, Jand Home Properties has grown into a synonym for trust and excellence. We saw a gap in the market for a firm that combined deep local market knowledge with international service standards.
                            </p>
                            <p>
                                From the bustling streets of Victoria Island to the serene enclaves of Ikoyi, our portfolio represents the pinnacle of Lagos living. We meticulously vet every property, ensuring that our clients view only the most exceptional opportunities.
                            </p>
                            <p>
                                Our team consists of seasoned professionals who understand that purchasing property is one of life's most significant decisions. We guide our clients with transparency, integrity, and discretion.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[600px] bg-slate-900 overflow-hidden rounded-lg shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop"
                            alt="Jand Homes Team"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-32 bg-secondary/20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
                    <div
                        className="bg-card p-12 rounded-3xl border border-border shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                        <h3 className="text-3xl font-serif text-foreground mb-6">Our Mission</h3>
                        <p className="text-muted-foreground text-lg font-light leading-relaxed">
                            To redefine the real estate experience in Nigeria through uncompromising integrity, architectural innovation, and a commitment to creating value that transcends generations.
                        </p>
                    </div>
                    <div
                        className="bg-slate-900 p-12 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                        <h3 className="text-3xl font-serif text-white mb-6">Our Vision</h3>
                        <p className="text-slate-400 text-lg font-light leading-relaxed">
                            To be the most trusted and sought-after real estate curator in Africa, recognized globally for setting the standard in luxury, sustainability, and technological integration.
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-32 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Architects of Success</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-foreground">Our Leadership Team</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { name: "Adebayo Johnson", role: "Chief Executive Officer", bio: "With over 20 years in international luxury real estate, Adebayo leads with a vision for perfection and structural integrity." },
                            { name: "Sarah Okon", role: "Head of Client Relations", bio: "Sarah ensures that every interaction with Jand Homes is marked by discretion, professionalism, and personalized care." },
                            { name: "Michael Obinna", role: "Chief Design Officer", bio: "An award-winning architect, Michael oversees the design language of every property in the Jand portfolio." }
                        ].map((person, i) => (
                            <div key={i} className="group">
                                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-muted relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={`https://images.unsplash.com/photo-${i === 0 ? '1560250097-0b93528c311a' : i === 1 ? '1573496359142-b8d87734a5a2' : '1519085360753-af0119f7cbe7'}?q=80&w=1887&auto=format&fit=crop`}
                                        alt={person.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <h4 className="text-xl font-serif text-foreground mb-1">{person.name}</h4>
                                <p className="text-primary text-xs uppercase tracking-widest font-bold mb-4">{person.role}</p>
                                <p className="text-muted-foreground text-sm font-light leading-relaxed">{person.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investment Philosophy */}
            < section className="py-32 bg-slate-950 text-white relative overflow-hidden" >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">The Jand Approach</span>
                            <h2 className="font-serif text-4xl md:text-6xl leading-tight">Investment-First <br /><span className="italic text-white/60">Philosophy.</span></h2>
                            <div className="space-y-6 text-white/70 text-lg font-light leading-relaxed">
                                <p>At Jand Homes Properties, we believe that a residence should be as much a financial fortress as it is a sanctuary. Our "Investment-First" approach means we only curate properties with high-growth potential and exceptional rental yield possibilities.</p>
                                <p>We conduct rigorous due diligence on land titles, structural quality, and district development plans to ensure your legacy is protected for generations to come.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4 pt-12">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                                    <span className="text-primary text-3xl font-serif block mb-2">12.5%</span>
                                    <p className="text-white/50 text-xs uppercase tracking-widest">Avg. Annual Appreciation</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                                    <span className="text-primary text-3xl font-serif block mb-2">100%</span>
                                    <p className="text-white/50 text-xs uppercase tracking-widest">Title Verification</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                                    <span className="text-primary text-3xl font-serif block mb-2">₦2.4T</span>
                                    <p className="text-white/50 text-xs uppercase tracking-widest">Managed Portfolio</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                                    <span className="text-primary text-3xl font-serif block mb-2">98.4%</span>
                                    <p className="text-white/50 text-xs uppercase tracking-widest">Client Retention</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Final CTA */}
            < section className="py-32 bg-background border-t border-border" >
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8">Ready to start your <br /><span className="italic text-muted-foreground animate-pulse">Legacy?</span></h2>
                    <p className="text-muted-foreground text-xl font-light mb-12 max-w-2xl mx-auto">
                        Connect with one of our senior partners today for a confidential private consultation.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button size="lg" className="rounded-full px-12 h-14 bg-primary text-white hover:bg-primary/90 text-sm font-bold tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95" asChild>
                            <a href="/contact">SCHEDULE A CONSULTATION</a>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-border text-foreground hover:bg-muted text-sm font-bold tracking-widest transition-all active:scale-95" asChild>
                            <a href="/properties">VIEW PORTFOLIO</a>
                        </Button>
                    </div>
                </div>
            </section >

            <PremiumFooter />
        </main >
    );
}
