"use client";

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// We need a Label component actually, let's just inline or create one quickly? 
// Standard Input usually needs a Label. I'll stick to clear placeholders or create a simple Label.
// Adding Label component definition here or in a separate file is cleaner. I'll verify if I made one. I didn't. 
// I will create a simple Label inside here or use standard html label for now to save a tool call, 
// OR I can lazily create it. I will use standard label with tailwind.

const userAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().optional(), // For register
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    type: "login" | "register";
}

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const router = useRouter();

    const form = useForm<z.infer<typeof userAuthSchema>>({
        resolver: zodResolver(userAuthSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
    })

    async function onSubmit(data: z.infer<typeof userAuthSchema>) {
        setIsLoading(true)

        try {
            const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
            const payload = type === 'login'
                ? { email: data.email, password: data.password }
                : { email: data.email, password: data.password, role: 'viewer' }; // Default role for now

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Authentication failed");
            }

            toast.success(type === 'login' ? "Welcome back!" : "Account created successfully");

            // Redirect
            setTimeout(() => {
                router.push('/admin/dashboard');
                router.refresh();
            }, 1000);

        } catch (error) {
            let msg = "Something went wrong.";
            if (error instanceof Error) msg = error.message;
            toast.error(msg);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    {type === 'register' && (
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                                Name
                            </label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="name"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <Input
                            id="password"
                            placeholder="******"
                            type="password"
                            autoComplete={type === 'register' ? "new-password" : "current-password"}
                            disabled={isLoading}
                            {...form.register("password")}
                        />
                        {form.formState.errors.password && (
                            <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <Button disabled={isLoading} variant="premium" className="w-full mt-2">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {type === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button variant="outline" type="button" disabled={isLoading} onClick={() => toast.info("Google Auth not implemented in MVP")}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                )}
                Google
            </Button>
        </div>
    )
}
