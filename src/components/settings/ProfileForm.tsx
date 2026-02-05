"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/user/me');
                if (res.ok) {
                    const data = await res.json();
                    form.reset({
                        name: data.name,
                        email: data.email,
                        password: "",
                        confirmPassword: ""
                    });
                } else {
                    toast.error("Failed to load profile");
                }
            } catch (e) {
                toast.error("Error loading profile");
            } finally {
                setIsFetching(false);
            }
        }
        fetchProfile();
    }, [form]);

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password // Only send if not empty, API handles generic check
                })
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Profile updated successfully");
            form.setValue("password", "");
            form.setValue("confirmPassword", "");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetching) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                    Manage your account settings and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input {...form.register("name")} placeholder="Your name" className="bg-background border-border" />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive font-medium">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <Input {...form.register("email")} placeholder="email@example.com" type="email" className="bg-background border-border" />
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive font-medium">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">New Password (Optional)</label>
                            <Input {...form.register("password")} type="password" placeholder="••••••" className="bg-background border-border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                            <Input {...form.register("confirmPassword")} type="password" placeholder="••••••" className="bg-background border-border" />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-xs text-destructive font-medium">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
