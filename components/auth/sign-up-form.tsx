"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, signUpBaseSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { SocialAuthButtons } from "./social-auth-buttons";

/**
 * Form untuk sign up / registrasi user baru
 */
export function SignUpForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            // Validate dengan zod schema
            const result = signUpSchema.safeParse(value);
            if (!result.success) {
                const firstError = result.error.errors[0];
                toast.error("Validasi gagal", {
                    description:
                        firstError?.message || "Periksa kembali data Anda",
                });
                return;
            }

            setIsLoading(true);
            try {
                const authResult = await authClient.signUp.email({
                    email: value.email,
                    password: value.password,
                    name: value.name,
                });

                if (authResult.error) {
                    toast.error("Registrasi gagal", {
                        description:
                            authResult.error.message ||
                            "Silakan periksa kembali data Anda",
                    });
                    return;
                }

                toast.success("Registrasi berhasil", {
                    description: "Anda akan diarahkan ke dashboard",
                });

                router.push("/");
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
            {/* Name Field */}
            <form.Field
                name="name"
                validators={{
                    onChange: ({ value }) => {
                        const result =
                            signUpBaseSchema.shape.name.safeParse(value);
                        return result.success
                            ? undefined
                            : result.error.errors[0]?.message;
                    },
                }}
            >
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Nama</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            placeholder="Nama lengkap"
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

            {/* Email Field */}
            <form.Field
                name="email"
                validators={{
                    onChange: ({ value }) => {
                        const result =
                            signUpBaseSchema.shape.email.safeParse(value);
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

            {/* Password Field */}
            <form.Field
                name="password"
                validators={{
                    onChange: ({ value }) => {
                        const result =
                            signUpBaseSchema.shape.password.safeParse(value);
                        return result.success
                            ? undefined
                            : result.error.errors[0]?.message;
                    },
                }}
            >
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="password"
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

            {/* Confirm Password Field */}
            <form.Field
                name="confirmPassword"
                validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                        const password =
                            fieldApi.form.getFieldValue("password");
                        if (value !== password) {
                            return "Password tidak cocok";
                        }
                        if (!value) {
                            return "Konfirmasi password harus diisi";
                        }
                        return undefined;
                    },
                }}
            >
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>Konfirmasi Password</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="password"
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

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Spinner /> : "Daftar"}
            </Button>

            {/* Social Auth */}
            <SocialAuthButtons
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </form>
    );
}
