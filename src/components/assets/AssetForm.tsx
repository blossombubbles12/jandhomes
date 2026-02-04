"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Save, X, Building, MapPin, Ruler, DollarSign, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { AddressAutocomplete } from './AddressAutocomplete';

const assetSchema = z.object({
    name: z.string().min(2, "Name is required"),
    type: z.string().min(1, "Type is required"),
    status: z.string(),
    listingType: z.string(),
    isFeatured: z.boolean().default(false),
    description: z.string(),

    // Location
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string(),
    latitude: z.string(),
    longitude: z.string(),

    // Physical
    landSize: z.string(),
    buildingSize: z.string(),
    units: z.string(),
    floors: z.string(),
    yearBuilt: z.string(),

    // Financial
    purchasePrice: z.string().min(1, "Purchase price is required"),
    currentValuation: z.string().min(1, "Current valuation is required"),
    rentalIncome: z.string(),
    operatingCost: z.string(),

    // Media
    media: z.array(z.any()),
    attachments: z.array(z.any()),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
    initialData?: any;
    id?: string;
}

export function AssetForm({ initialData, id }: AssetFormProps) {
    const router = useRouter();
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: initialData ? {
            ...initialData,
            // Ensure values are strings for input
            purchasePrice: initialData.purchasePrice?.toString() || "0",
            currentValuation: initialData.currentValuation?.toString() || "0",
            rentalIncome: initialData.rentalIncome?.toString() || "",
            operatingCost: initialData.operatingCost?.toString() || "",
            landSize: initialData.landSize?.toString() || "",
            buildingSize: initialData.buildingSize?.toString() || "",
            units: initialData.units?.toString() || "",
            floors: initialData.floors?.toString() || "",
            yearBuilt: initialData.yearBuilt?.toString() || "",
            latitude: initialData.latitude?.toString() || "",
            longitude: initialData.longitude?.toString() || "",
            status: initialData.status || "Available",
            listingType: initialData.listingType || "For Sale",
            isFeatured: initialData.isFeatured || false,
            country: initialData.country || "Nigeria",
            media: Array.isArray(initialData.media) ? initialData.media : (typeof initialData.media === 'string' ? JSON.parse(initialData.media) : []),
            attachments: Array.isArray(initialData.attachments) ? initialData.attachments : (typeof initialData.attachments === 'string' ? JSON.parse(initialData.attachments) : []),
        } : {
            name: "",
            type: "Residential",
            status: "Available",
            listingType: "For Sale",
            isFeatured: false,
            country: "Nigeria",
            purchasePrice: "0",
            currentValuation: "0",
            media: [],
            attachments: [],
            address: "",
            city: "",
            state: "",
            description: "",
        },
    });

    const { setValue, watch, register } = form;
    const media = watch('media') || [];
    const attachments = watch('attachments') || [];
    const assetName = watch('name');

    // Register media fields explicitly
    React.useEffect(() => {
        register('media');
        register('attachments');
    }, [register]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: AssetFormValues) => {
        try {
            const endpoint = id ? `/api/assets/${id}` : '/api/assets';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Failed to save asset');

            toast.success(`Asset ${id ? 'updated' : 'created'} successfully`);
            router.push('/admin/assets');
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white/90">{id ? 'Edit Asset' : 'New Asset'}</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" type="button" onClick={() => router.back()}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button variant="premium" type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {id ? 'Save Changes' : 'Create Asset'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <Building className="h-5 w-5" /> Basics
                    </div>
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Asset Name</label>
                                <Input {...form.register("name")} placeholder="e.g. Sunset Heights Apartment" className="bg-slate-800 border-slate-700" />
                                {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Type</label>
                                    <select {...form.register("type")} className="w-full bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none">
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Land">Land</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Status</label>
                                    <select {...form.register("status")} className="w-full bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none">
                                        <option value="Available">Available</option>
                                        <option value="Under Contract">Under Contract</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Leased">Leased</option>
                                        <option value="Renovation">Renovation</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Listing Type</label>
                                    <select {...form.register("listingType")} className="w-full bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none">
                                        <option value="For Sale">For Sale</option>
                                        <option value="For Lease">For Lease</option>
                                        <option value="Shortlet">Shortlet</option>
                                        <option value="Development">Development Project</option>
                                        <option value="Not for Sale">Internal/Not for Sale</option>
                                    </select>
                                </div>
                                <div className="space-y-2 flex flex-col justify-end">
                                    <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            {...form.register("isFeatured")}
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">Featured Asset</span>
                                            <span className="text-[10px] text-slate-500">Show on homepage spotlight</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Description</label>
                                <textarea
                                    {...form.register("description")}
                                    className="w-full min-h-[100px] bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500 outline-none"
                                    placeholder="Tell us about this property..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Location Information */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <MapPin className="h-5 w-5" /> Location
                    </div>
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Search Address (Autocomplete)</label>
                                <AddressAutocomplete
                                    defaultValue={initialData?.address}
                                    onSelect={(s) => {
                                        setValue('address', s.fullAddress);
                                        setValue('city', s.city || '');
                                        setValue('state', s.state || '');
                                        setValue('latitude', s.lat);
                                        setValue('longitude', s.lon);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Street Address (Manual Check)</label>
                                <Input {...form.register("address")} className="bg-slate-800 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">City</label>
                                    <Input {...form.register("city")} className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">State/Province</label>
                                    <Input {...form.register("state")} className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Latitude (Optional)</label>
                                    <Input {...form.register("latitude")} placeholder="e.g. 34.0522" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Longitude (Optional)</label>
                                    <Input {...form.register("longitude")} placeholder="e.g. -118.2437" className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Financial Information */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <DollarSign className="h-5 w-5" /> Financials
                    </div>
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Purchase Price ($)</label>
                                    <Input {...form.register("purchasePrice")} type="number" step="0.01" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Current Valuation ($)</label>
                                    <Input {...form.register("currentValuation")} type="number" step="0.01" className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Monthly Rental Income ($)</label>
                                    <Input {...form.register("rentalIncome")} type="number" step="0.01" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Operating Cost ($)</label>
                                    <Input {...form.register("operatingCost")} type="number" step="0.01" className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Physical Attributes */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <Ruler className="h-5 w-5" /> Physical
                    </div>
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Building Size (sqft)</label>
                                    <Input {...form.register("buildingSize")} type="number" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Land Size (acres)</label>
                                    <Input {...form.register("landSize")} type="number" step="0.01" className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Units</label>
                                    <Input {...form.register("units")} type="number" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Floors</label>
                                    <Input {...form.register("floors")} type="number" className="bg-slate-800 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Year Built</label>
                                    <Input {...form.register("yearBuilt")} type="number" className="bg-slate-800 border-slate-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Media & Documents */}
                <section className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <Upload className="h-5 w-5" /> Media & Attachments
                    </div>
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardContent className="pt-6 space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-400">Visual Media (Images & Videos)</label>
                                <FileUploader
                                    value={media}
                                    onChange={(val) => setValue('media', val)}
                                    maxFiles={8}
                                    folder={assetName || 'unsorted'}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-400">Documents & Audio (PDFs, Contracts, Reports)</label>
                                <FileUploader
                                    value={attachments}
                                    onChange={(val) => setValue('attachments', val)}
                                    maxFiles={5}
                                    folder={assetName || 'unsorted'}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </form>
    );
}
