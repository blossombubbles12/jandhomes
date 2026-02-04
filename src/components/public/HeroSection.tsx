import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function HeroSection() {
    return (
        <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image / Video would go here */}
            <div className="absolute inset-0 bg-slate-900">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900 z-10" />

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-slate-900" />
            </div>

            <div className="container relative z-20 px-4 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-6 animate-fade-in-up">
                    Modern Living Redefined
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Find Your Place <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        In The Future
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Jand Homes offers exclusive access to premium residential and commercial developments. Experience luxury, sustainability, and innovation in every square foot.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[160px] h-12 text-base" asChild>
                        <Link href="/properties">Browse Properties</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:text-white min-w-[160px] h-12 text-base" asChild>
                        <Link href="/contact">Contact Sales</Link>
                    </Button>
                </div>
            </div>

            {/* Stats strip at bottom */}
            <div className="absolute bottom-0 w-full border-t border-white/5 bg-black/20 backdrop-blur-sm py-6 z-20 hidden md:block">
                <div className="container mx-auto px-4 flex justify-center gap-16 text-slate-400">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-white">50+</span>
                        <span className="text-xs uppercase tracking-widest">Properties</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-white">1500+</span>
                        <span className="text-xs uppercase tracking-widest">Happy Clients</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-white">100%</span>
                        <span className="text-xs uppercase tracking-widest">Satisfaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
