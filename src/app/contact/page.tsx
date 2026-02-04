import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us | Jand Home Properties",
    description: "Get in touch with us to start your real estate journey in Lagos.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            {/* Header */}
            <div className="relative pt-48 pb-24 bg-slate-950 overflow-hidden border-b border-border">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                        alt="Contact Us"
                        className="w-full h-full object-cover opacity-30 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 drop-shadow-lg">Contact Us</h1>
                        <p className="text-white/70 max-w-xl text-lg font-light leading-relaxed">
                            Let's start the conversation. Whether you're looking to acquire, divest, or simply explore Lagos's most exclusive districts, we are here to guide you.
                        </p>
                    </div>
                </div>
            </div>

            <section className="py-24">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
                    {/* Info Side */}
                    <div>
                        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Get In Touch</span>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full border border-input flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-medium mb-1">Visit Us</h4>
                                    <p className="text-muted-foreground font-light">
                                        12A Admiralty Way,<br />
                                        Lekki Phase 1, Lagos,<br />
                                        Nigeria
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full border border-input flex items-center justify-center text-primary shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-medium mb-1">Email Us</h4>
                                    <p className="text-muted-foreground font-light">
                                        hello@jandhomes.com<br />
                                        sales@jandhomes.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full border border-input flex items-center justify-center text-primary shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-medium mb-1">Call Us</h4>
                                    <p className="text-muted-foreground font-light">
                                        +234 812 345 6789<br />
                                        +234 809 876 5432
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-card p-8 md:p-12 border border-border rounded-lg shadow-sm">
                        <h3 className="font-serif text-2xl text-foreground mb-6">Send us a message</h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="w-full bg-background border border-input p-3 text-foreground focus:border-primary focus:outline-none transition-colors rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="w-full bg-background border border-input p-3 text-foreground focus:border-primary focus:outline-none transition-colors rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-background border border-input p-3 text-foreground focus:border-primary focus:outline-none transition-colors rounded-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full bg-background border border-input p-3 text-foreground focus:border-primary focus:outline-none transition-colors resize-none rounded-md"
                                />
                            </div>

                            <Button size="lg" className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground h-14 uppercase tracking-widest font-bold text-xs rounded-md" type="button">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    );
}
