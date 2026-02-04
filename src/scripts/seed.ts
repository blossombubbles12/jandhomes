const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now require the rest
const { db } = require('../lib/db');
const { assets } = require('../lib/schema');
const { logAction } = require('../lib/audit');

async function seed() {
    console.log('🌱 Seeding assets for Jand Homes Properties...');

    const sampleAssets = [
        {
            name: "Jand Homes - 4 Bedroom Terrace Duplex",
            type: "Residential",
            status: "Active",
            description: "Modern 4 bedroom terrace duplex with boys' quarters. High-quality finishing and 24/7 security.",
            address: "Olive Park Estate, Ajah",
            city: "Lagos",
            state: "Lagos",
            country: "Nigeria",
            latitude: "6.4674",
            longitude: "3.5711",
            purchasePrice: "120000000",
            currentValuation: "135000000",
            rentalIncome: "4500000",
            operatingCost: "800000",
            buildingSize: "280",
            units: 1,
            yearBuilt: 2023,
        },
        {
            name: "Jand Homes - 5 Bedroom Semi-Detached Duplex",
            type: "Residential",
            status: "Active",
            description: "Spacious semi-detached duplex in a serene neighborhood. Featuring smart home automation and greenery.",
            address: "Lake View Park 2, near VGC",
            city: "Lekki",
            state: "Lagos",
            country: "Nigeria",
            latitude: "6.4621",
            longitude: "3.5134",
            purchasePrice: "185000000",
            currentValuation: "210000000",
            rentalIncome: "6500000",
            operatingCost: "1200000",
            buildingSize: "450",
            units: 1,
            yearBuilt: 2024,
        },
        {
            name: "Jand Homes - Luxury 4 Bedroom Terrace",
            type: "Residential",
            status: "Under Contract",
            description: "Waterfront luxury terrace duplex with premium amenities and breathtaking views of the lake.",
            address: "Lake View Park 1, VGC Axis",
            city: "Lekki",
            state: "Lagos",
            country: "Nigeria",
            latitude: "6.4635",
            longitude: "3.5150",
            purchasePrice: "155000000",
            currentValuation: "170000000",
            rentalIncome: "5500000",
            operatingCost: "1000000",
            buildingSize: "320",
            units: 1,
            yearBuilt: 2022,
        }
    ];

    try {
        for (const assetData of sampleAssets) {
            const [newAsset] = await db.insert(assets).values({
                ...assetData,
                isDeleted: false,
            }).returning();
            
            console.log(`✅ Inserted: ${newAsset.name} (ID: ${newAsset.id})`);
        }
        console.log('✨ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

seed().then(() => process.exit());
