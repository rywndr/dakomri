"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Trash2, AlertTriangle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface KomunitasActionsProps {
    submissionId: string;
    memberName: string;
}

export function KomunitasActions({
    submissionId,
    memberName,
}: KomunitasActionsProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/submissions/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete member");
            }

            toast.success("Anggota berhasil dihapus", {
                description: `Data ${memberName} telah dihapus dari komunitas`,
            });

            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menghapus data anggota",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = () => {
        router.push(`/admin/submissions/${submissionId}`);
    };

    const handleEdit = () => {
        router.push(`/admin/submissions/${submissionId}/edit`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewDetails}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus dari Komunitas
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Hapus Anggota Komunitas
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus{" "}
                            <span className="font-semibold">{memberName}</span>{" "}
                            dari komunitas?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="font-semibold text-sm text-destructive">
                                    Peringatan Penting!
                                </p>
                                <p className="text-sm">
                                    Tindakan ini akan{" "}
                                    <strong>menghapus permanen</strong>:
                                </p>
                                <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                                    <li>Data anggota dari komunitas</li>
                                    <li>
                                        Formulir pendaftaran (submission)
                                        terkait
                                    </li>
                                    <li>Semua informasi yang tersimpan</li>
                                </ul>
                                <p className="text-sm font-medium">
                                    Tindakan ini{" "}
                                    <strong>tidak dapat dibatalkan</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Menghapus..." : "Hapus Permanen"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
