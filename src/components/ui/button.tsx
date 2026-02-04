"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                premium: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 shadow-lg shadow-emerald-500/20 border-0",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        // If we want Framer Motion animation on tap
        const Comp = asChild ? Slot : motion.button;

        // Type assertion for motion.button props as they are slightly different, 
        // but standard HTML attributes usually pass through fine.
        // Simplifying: wrapping standard button in motion for specific effect or just using standard if asChild.

        if (asChild) {
            return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        }

        return (
            <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref as any}
                {...(props as any)}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
