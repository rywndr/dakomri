"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface SocialAuthButtonsProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    callbackURL?: string;
}

function AuthDivider() {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Atau lanjutkan dengan
                </span>
            </div>
        </div>
    );
}

/**
 * Social auth button
 */
export function SocialAuthButtons({
    isLoading,
    setIsLoading,
    callbackURL = "/",
}: SocialAuthButtonsProps) {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleAuth = async () => {
        setIsGoogleLoading(true);
        setIsLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL,
            });
        } catch {
            toast.error("Login dengan Google gagal", {
                description: "Silakan coba lagi nanti",
            });
            setIsLoading(false);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <>
            <AuthDivider />
            <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGoogleAuth}
                className="w-full"
            >
                {isGoogleLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <Image
                            src="/gooogle.svg"
                            alt="Google"
                            width={16}
                            height={16}
                            className="mr-2"
                        />
                        Google
                    </>
                )}
            </Button>
        </>
    );
}
