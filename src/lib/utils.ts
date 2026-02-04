import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number | null | undefined) {
    if (!value) return '₦0';
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(Number(value)).replace('NGN', '₦');
}
