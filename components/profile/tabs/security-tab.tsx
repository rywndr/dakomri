"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi input
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Semua field harus diisi");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password baru minimal 8 karakter");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Password baru tidak cocok");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("Password baru harus berbeda dari password lama");
            return;
        }

        setIsLoading(true);

        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: false, // Tidak logout dari sesi lain
            });

            toast.success("Password berhasil diubah");

            // Reset form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error changing password:", error);

            // Handle specific error messages
            const errorMessage = error instanceof Error ? error.message : "";
            if (errorMessage.includes("incorrect")) {
                toast.error("Password lama tidak benar");
            } else {
                toast.error("Gagal mengubah password");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5" />
                    <CardTitle>Keamanan</CardTitle>
                </div>
                <CardDescription>
                    Ubah password untuk meningkatkan keamanan akun Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Password Lama */}
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Password Lama</Label>
                        <PasswordInput
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Masukkan password lama"
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Password Baru */}
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <PasswordInput
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Masukkan password baru"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-muted-foreground">
                            Minimal 8 karakter
                        </p>
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                            Konfirmasi Password Baru
                        </Label>
                        <PasswordInput
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi password baru"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            Ubah Password
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
