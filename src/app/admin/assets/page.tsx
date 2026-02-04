import { AssetTable } from "@/components/assets/AssetTable";

export default function AssetsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white/90">Portfolio Assets</h2>
                    <p className="text-muted-foreground mt-1">
                        Viewing and managing all real estate assets in your portfolio.
                    </p>
                </div>
            </div>

            <AssetTable />
        </div>
    );
}
