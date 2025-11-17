"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    Trash2,
    Edit,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SubmissionActionsProps {
    submissionId: string;
    currentStatus: string;
    submitterName: string;
    rejectionReason?: string | null;
}

export function SubmissionActions({
    submissionId,
    currentStatus,
    submitterName,
    rejectionReason,
}: SubmissionActionsProps) {
    const router = useRouter();
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [adminNotes, setAdminNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/submissions/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId,
                    adminNotes,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to approve submission");
            }

            toast.success("Submission berhasil disetujui", {
                description: `Formulir ${submitterName} telah diverifikasi`,
            });

            setIsApproveDialogOpen(false);
            setAdminNotes("");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menyetujui submission",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Validasi gagal", {
                description: "Alasan penolakan harus diisi",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/submissions/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId,
                    rejectionReason: rejectReason,
                    adminNotes,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to reject submission");
            }

            toast.success("Submission berhasil ditolak", {
                description: `Formulir ${submitterName} telah ditolak`,
            });

            setIsRejectDialogOpen(false);
            setRejectReason("");
            setAdminNotes("");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menolak submission",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                throw new Error("Failed to delete submission");
            }

            toast.success("Submission berhasil dihapus", {
                description: `Formulir ${submitterName} telah dihapus dari sistem`,
            });

            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menghapus submission",
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

    const canApprove = currentStatus === "submitted";
    const canReject =
        currentStatus === "submitted" || currentStatus === "verified";

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
                    {canApprove && (
                        <DropdownMenuItem
                            onClick={() => setIsApproveDialogOpen(true)}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Setujui
                        </DropdownMenuItem>
                    )}
                    {canReject && (
                        <DropdownMenuItem
                            onClick={() => setIsRejectDialogOpen(true)}
                            className="text-destructive focus:text-destructive"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Tolak
                        </DropdownMenuItem>
                    )}
                    {currentStatus === "rejected" && rejectionReason && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsReasonDialogOpen(true)}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Lihat Alasan Penolakan
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Submission
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Approve dialog */}
            <Dialog
                open={isApproveDialogOpen}
                onOpenChange={setIsApproveDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Submission</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menyetujui formulir dari{" "}
                            {submitterName}? Status akan diubah menjadi
                            &quot;Disetujui&quot;.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-notes">
                                Catatan Admin (Opsional)
                            </Label>
                            <Textarea
                                id="admin-notes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Tambahkan catatan untuk submission ini..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsApproveDialogOpen(false);
                                setAdminNotes("");
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleApprove} disabled={isLoading}>
                            {isLoading ? "Memproses..." : "Setujui"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Submission</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk formulir dari{" "}
                            {submitterName}. Alasan ini akan disimpan dalam
                            sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reject-reason">
                                Alasan Penolakan *
                            </Label>
                            <Textarea
                                id="reject-reason"
                                value={rejectReason}
                                onChange={(e) =>
                                    setRejectReason(e.target.value)
                                }
                                placeholder="Masukkan alasan penolakan..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-notes-reject">
                                Catatan Admin (Opsional)
                            </Label>
                            <Textarea
                                id="admin-notes-reject"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Tambahkan catatan internal..."
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                setRejectReason("");
                                setAdminNotes("");
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isLoading}
                        >
                            {isLoading ? "Memproses..." : "Tolak"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog penolakan */}
            <Dialog
                open={isReasonDialogOpen}
                onOpenChange={setIsReasonDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alasan Penolakan</DialogTitle>
                        <DialogDescription>
                            Submission dari {submitterName} ditolak dengan
                            alasan berikut:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm whitespace-pre-wrap">
                                {rejectionReason}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsReasonDialogOpen(false)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Submission</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus formulir dari{" "}
                            {submitterName}? Tindakan ini tidak dapat dibatalkan
                            dan semua data akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>
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
                            {isLoading ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
