"use client";

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialAuthButtonsProps {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    callbackURL?: string;
}

/**
 * Social auth buttons dengan divider
 */
export function SocialAuthButtons({
    isLoading,
    setIsLoading,
    callbackURL = "/",
}: SocialAuthButtonsProps) {
    const handleGoogleAuth = async () => {
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
        }
    };

    return (
        <>
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

            <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGoogleAuth}
                className="w-full"
            >
                <Image src="/gooogle.svg" alt="Google" width={16} height={16} />
                Google
            </Button>
        </>
    );
}
