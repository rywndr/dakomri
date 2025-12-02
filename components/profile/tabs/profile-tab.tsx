"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileTabProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
    };
}

export function ProfileTab({ user }: ProfileTabProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user.name || "");

    /**
     * Handle update nama user
     */
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Nama tidak boleh kosong");
            return;
        }

        setIsLoading(true);

        try {
            await authClient.updateUser({
                name: name.trim(),
            });

            await fetch("/api/user/revalidate-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id }),
            });

            toast.success("Profil berhasil diperbarui");
            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Gagal memperbarui profil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                    Perbarui informasi profil Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama Anda"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Nama ini akan ditampilkan di profil Anda
                        </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Perubahan email belum tersedia saat ini
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
