"use client";

import { useForm } from "@tanstack/react-form";
import { signInSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SocialAuthButtons } from "./social-auth-buttons";
import { FormField } from "./form-field";
import { useAuth } from "@/hooks/use-auth";

/**
 * Form component untuk sign in
 */
export function SignInForm() {
    const { isLoading, isSubmitting, setLoading, handleSignIn } = useAuth();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: ({ value }) => handleSignIn(value),
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

            <Button type="submit" disabled={isLoading} className="w-full">
                {isSubmitting ? <Spinner /> : "Masuk"}
            </Button>

            <SocialAuthButtons
                isLoading={isLoading}
                setIsLoading={setLoading}
            />
        </form>
    );
}
