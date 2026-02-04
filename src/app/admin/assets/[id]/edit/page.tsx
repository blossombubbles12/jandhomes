import { AssetForm } from "@/components/assets/AssetForm";
import { db } from "@/lib/db";
import { assets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));

    if (!asset || asset.isDeleted) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <AssetForm initialData={asset} id={id} />
        </div>
    );
}
