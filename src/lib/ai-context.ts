import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function getPortfolioContext() {
  const allAssets = await db.select().from(assets).where(eq(assets.isDeleted, false));

  const totalValue = allAssets.reduce((sum, a) => sum + (Number(a.currentValuation) || 0), 0);
  const totalIncome = allAssets.reduce((sum, a) => sum + (Number(a.rentalIncome) || 0), 0);
  const count = allAssets.length;

  const typeDistribution = allAssets.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAssets = [...allAssets]
    .sort((a, b) => (Number(b.currentValuation) || 0) - (Number(a.currentValuation) || 0))
    .slice(0, 5)
    .map(a => `${a.name} (Valuation: ₦${Number(a.currentValuation).toLocaleString()})`);

  return `
    COMPANY: Jand Homes Properties (Nigeria)
    PORTFOLIO SUMMARY:
    - Total Assets: ${count}
    - Total Valuation: ₦${totalValue.toLocaleString()}
    - Total Monthly Rental Income: ₦${totalIncome.toLocaleString()}
    - Asset Types: ${Object.entries(typeDistribution).map(([type, count]) => `${count} ${type}`).join(', ')}
    - Top Assets: ${topAssets.join(', ')}
    
    Currency is in Nigerian Naira (₦).
  `;
}

export async function getAssetContext(assetId: string) {
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId));

  if (!asset) return "Asset not found.";

  return `
    COMPANY: Jand Homes Properties (Nigeria)
    CURRENT ASSET DETAILS:
    - Name: ${asset.name}
    - Type: ${asset.type}
    - Status: ${asset.status}
    - Location: ${asset.address}, ${asset.city}, ${asset.state}, ${asset.country}
    - Coordinates: Lat ${asset.latitude}, Lng ${asset.longitude}
    - Current Valuation: ₦${Number(asset.currentValuation).toLocaleString()}
    - Purchase Price: ₦${Number(asset.purchasePrice).toLocaleString()}
    - Monthly Rental Income: ₦${Number(asset.rentalIncome || 0).toLocaleString()}
    - Operating Cost: ₦${Number(asset.operatingCost || 0).toLocaleString()}
    - Year Built: ${asset.yearBuilt || 'N/A'}
    - Building Size: ${asset.buildingSize || 'N/A'} sqm
    - Units: ${asset.units || 1}, Floors: ${asset.floors || 1}
    - Description: ${asset.description}
    
    Currency is in Nigerian Naira (₦).
  `;
}
