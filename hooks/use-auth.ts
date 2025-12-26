import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SignInFormData, SignUpFormData } from "@/lib/auth-schemas";

interface AuthState {
    isLoading: boolean; // Global loading (disable input)
    isSubmitting: boolean; // Form submission loading (spinner button)
}

interface UseAuthReturn extends AuthState {
    setLoading: (loading: boolean) => void;
    handleSignIn: (values: SignInFormData) => Promise<void>;
    handleSignUp: (values: SignUpFormData) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    };

    const handleSignIn = async (values: SignInFormData) => {
        setIsLoading(true);
        setIsSubmitting(true);
        try {
            const result = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });

            if (result.error) {
                toast.error("Login gagal", {
                    description:
                        result.error.message || "Email atau password salah",
                });
                setIsLoading(false);
                setIsSubmitting(false);
                return;
            }

            toast.success("Login berhasil", {
                description: "Anda akan diarahkan ke home page",
            });

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi nanti",
            });
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleSignUp = async (values: SignUpFormData) => {
        setIsLoading(true);
        setIsSubmitting(true);
        try {
            const authResult = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
            });

            if (authResult.error) {
                toast.error("Registrasi gagal", {
                    description:
                        authResult.error.message ||
                        "Silakan periksa kembali data Anda",
                });
                setIsLoading(false);
                setIsSubmitting(false);
                return;
            }

            toast.success("Registrasi berhasil", {
                description: "Anda akan diarahkan ke home page",
            });

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi nanti",
            });
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    return {
        isLoading,
        isSubmitting,
        setLoading,
        handleSignIn,
        handleSignUp,
    };
}
