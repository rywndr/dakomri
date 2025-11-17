"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password";
import { toast } from "sonner";
import { SocialAuthButtons } from "./social-auth-buttons";

/**
 * Form component untuk sign in
 */
export function SignInForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                const result = await authClient.signIn.email({
                    email: value.email,
                    password: value.password,
                });

                if (result.error) {
                    toast.error("Login gagal", {
                        description:
                            result.error.message || "Email atau password salah",
                    });
                    return;
                }

                toast.success("Login berhasil", {
                    description: "Anda akan diarahkan ke dashboard",
                });

                router.push("/");
                router.refresh();
            } catch {
                toast.error("Terjadi kesalahan", {
                    description: "Silakan coba lagi nanti",
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-4"
        >
            <form.Field
                name="email"
                validators={{
                    onChange: ({ value }) => {
                        const result =
                            signInSchema.shape.email.safeParse(value);
                        return result.success
                            ? undefined
                            : result.error.errors[0]?.message;
                    },
                }}
            >
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            placeholder="nama@email.com"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            disabled={isLoading}
                            aria-invalid={field.state.meta.errors.length > 0}
                        />
                        {field.state.meta.errors.length > 0 && (
                            <span className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </span>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onChange: ({ value }) => {
                        const result =
                            signInSchema.shape.password.safeParse(value);
                        return result.success
                            ? undefined
                            : result.error.errors[0]?.message;
                    },
                }}
            >
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Password</Label>
                        <PasswordInput
                            id={field.name}
                            name={field.name}
                            placeholder="••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            disabled={isLoading}
                            aria-invalid={field.state.meta.errors.length > 0}
                        />
                        {field.state.meta.errors.length > 0 && (
                            <span className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </span>
                        )}
                    </div>
                )}
            </form.Field>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Spinner /> : "Masuk"}
            </Button>

            <SocialAuthButtons
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </form>
    );
}
