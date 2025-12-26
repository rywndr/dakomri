"use client";

import { useForm } from "@tanstack/react-form";
import { signUpSchema, signUpBaseSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { SocialAuthButtons } from "./social-auth-buttons";
import { FormField } from "./form-field";
import { useAuth } from "@/hooks/use-auth";

/**
 * Form untuk sign up / registrasi user baru
 */
export function SignUpForm() {
    const { isLoading, isSubmitting, setLoading, handleSignUp } = useAuth();

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

            await handleSignUp(value);
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
                    <FormField
                        id={field.name}
                        name={field.name}
                        label="Nama"
                        placeholder="Nama lengkap"
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        disabled={isLoading}
                        error={field.state.meta.errors[0]}
                    />
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
                    <FormField
                        id={field.name}
                        name={field.name}
                        label="Email"
                        type="email"
                        placeholder="nama@email.com"
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        disabled={isLoading}
                        error={field.state.meta.errors[0]}
                    />
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
                    <FormField
                        id={field.name}
                        name={field.name}
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        disabled={isLoading}
                        error={field.state.meta.errors[0]}
                    />
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
                    <FormField
                        id={field.name}
                        name={field.name}
                        label="Konfirmasi Password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        disabled={isLoading}
                        error={field.state.meta.errors[0]}
                    />
                )}
            </form.Field>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
                {isSubmitting ? <Spinner /> : "Daftar"}
            </Button>

            {/* Social Auth */}
            <SocialAuthButtons
                isLoading={isLoading}
                setIsLoading={setLoading}
            />
        </form>
    );
}
