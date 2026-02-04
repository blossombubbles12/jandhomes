import Link from 'next/link';
import { ArrowLeft, Home, Building2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ConfigurableNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Home size={18} />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">Jand Homes</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/properties?status=For Sale" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                            Buy
                        </Link>
                        <Link href="/properties?status=For Lease" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                            Rent
                        </Link>
                        <Link href="/properties?status=Development" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                            Developments
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Find your dream home..."
                            className="bg-slate-800/50 border-slate-700 text-sm h-9 pl-9 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                        <Link href="/admin/login">Admin Access</Link>
                    </Button>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
                        Contact Us
                    </Button>
                </div>
            </div>
        </nav>
    );
}
