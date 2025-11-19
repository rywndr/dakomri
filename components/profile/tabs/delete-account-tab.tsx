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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

export function DeleteAccountTab() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const CONFIRM_TEXT = "HAPUS AKUN SAYA";

    /**
     * Handle hapus akun user
     */
    const handleDeleteAccount = async () => {
        if (confirmText !== CONFIRM_TEXT) {
            toast.error("Teks konfirmasi tidak sesuai");
            return;
        }

        setIsLoading(true);

        try {
            await authClient.deleteUser();

            toast.success("Akun berhasil dihapus");

            // Redirect ke home
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Gagal menghapus akun");
        } finally {
            setIsLoading(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="size-5 text-destructive" />
                    <CardTitle className="text-destructive">
                        Zona Berbahaya
                    </CardTitle>
                </div>
                <CardDescription>
                    Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="font-medium">Hapus Akun</h4>
                    <div className="text-sm text-muted-foreground">
                        Menghapus akun Anda akan menghapus semua data yang
                        terkait dengan akun ini, termasuk:
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>Informasi profil pribadi</li>
                        <li>Data formulir yang telah disubmit</li>
                        <li>Semua sesi login aktif</li>
                        <li>Riwayat aktivitas</li>
                    </ul>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
                        <div className="text-sm font-medium text-destructive">
                            ⚠️ Peringatan: Tindakan ini bersifat permanen
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Data yang sudah dihapus tidak dapat dipulihkan
                            kembali.
                        </div>
                    </div>
                </div>

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto"
                        >
                            Hapus Akun Permanen
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apakah Anda yakin ingin menghapus akun?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-4">
                                <div>
                                    Tindakan ini akan menghapus akun Anda secara
                                    permanen beserta semua data yang terkait.
                                    Anda akan logout secara otomatis dan tidak
                                    dapat login kembali dengan akun ini.
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-delete">
                                        Ketik{" "}
                                        <span className="font-mono font-bold">
                                            {CONFIRM_TEXT}
                                        </span>{" "}
                                        untuk konfirmasi
                                    </Label>
                                    <Input
                                        id="confirm-delete"
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) =>
                                            setConfirmText(e.target.value)
                                        }
                                        placeholder={CONFIRM_TEXT}
                                        disabled={isLoading}
                                    />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAccount();
                                }}
                                disabled={
                                    confirmText !== CONFIRM_TEXT || isLoading
                                }
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Hapus Akun Permanen
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
