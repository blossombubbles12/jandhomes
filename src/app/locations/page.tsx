import { db } from "@/lib/db";
import { assets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { MapSearchContainer } from "@/components/public/premium/MapSearchContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Interactive Map Search | Jand Homes Properties",
    description: "Explore our exclusive portfolio across Lagos using our interactive map search. Filter by district, property type, and more.",
};

// Revalidate every 30 minutes for fresh listings
export const revalidate = 1800;

export default async function MapSearchPage() {
    const allAssets = await db.select()
        .from(assets)
        .where(eq(assets.isDeleted, false));

    return (
        <main className="min-h-screen bg-background text-foreground font-sans">
            <PremiumNavbar />
            <div className="pt-20 lg:pt-20"> {/* Offset for Fixed Navbar */}
                <MapSearchContainer initialAssets={allAssets} />
            </div>
        </main>
    );
}
