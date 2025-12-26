"use client";

// hmmphh tau kok ini bloat bangett tpi yodah la T_T, satu file
// untuk semua user action, if someone want's to tidy this up
// please... be my guest :>

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    MoreHorizontal,
    Shield,
    UserX,
    UserCheck,
    Trash2,
    Edit,
    Key,
    Link2,
    Unlink,
    Check,
    ChevronsUpDown,
    Search,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { toast } from "sonner";

interface UserActionsProps {
    userId: string;
    currentRole: string | null;
    userName: string;
    userEmail: string;
    isBanned?: boolean;
    hasSubmission?: boolean;
    submissionId?: string | null;
}

/**
 * User actions dropdown component
 * Provides role management, user update, and user actions
 */
export function UserActions({
    userId,
    currentRole,
    userName,
    userEmail,
    isBanned = false,
    hasSubmission = false,
    submissionId = null,
}: UserActionsProps) {
    const router = useRouter();
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState(currentRole || "user");
    const [updateName, setUpdateName] = useState(userName);
    const [updateEmail, setUpdateEmail] = useState(userEmail);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [unlinkedSubmissions, setUnlinkedSubmissions] = useState<
        Array<{
            id: string;
            namaDepan: string;
            namaBelakang: string | null;
            namaAlias: string | null;
            nik: string;
            kota: string;
            kontakTelp: string;
            status: string | null;
            createdAt: Date;
            createdBy: string | null;
        }>
    >([]);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

    const handleSetRole = async () => {
        setIsLoading(true);
        try {
            await authClient.admin.setRole({
                userId,
                role: selectedRole as "user" | "admin",
            });

            toast.success("Role berhasil diubah", {
                description: `Role ${userName} telah diubah menjadi ${selectedRole}`,
            });

            setIsRoleDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal mengubah role pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!updateName.trim() || !updateEmail.trim()) {
            toast.error("Validasi gagal", {
                description: "Nama dan email tidak boleh kosong",
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateEmail)) {
            toast.error("Validasi gagal", {
                description: "Format email tidak valid",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Use Better Auth admin updateUser method
            await authClient.admin.updateUser({
                userId,
                data: {
                    name: updateName,
                    email: updateEmail,
                },
            });

            toast.success("Pengguna berhasil diperbarui", {
                description: `Data ${updateName} telah diperbarui`,
            });

            setIsUpdateDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal memperbarui data pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBanUser = async () => {
        setIsLoading(true);
        try {
            await authClient.admin.banUser({
                userId,
                banReason: "Banned by admin",
            });

            toast.success("Pengguna berhasil diblokir", {
                description: `${userName} telah diblokir`,
            });

            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal memblokir pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnbanUser = async () => {
        setIsLoading(true);
        try {
            await authClient.admin.unbanUser({
                userId,
            });

            toast.success("Pengguna berhasil dibuka blokirnya", {
                description: `${userName} dapat mengakses sistem kembali`,
            });

            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal membuka blokir pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetPassword = async () => {
        if (!newPassword.trim()) {
            toast.error("Validasi gagal", {
                description: "Password tidak boleh kosong",
            });
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Validasi gagal", {
                description: "Password minimal 8 karakter",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Validasi gagal", {
                description: "Password dan konfirmasi tidak cocok",
            });
            return;
        }

        setIsLoading(true);
        try {
            await authClient.admin.setUserPassword({
                userId,
                newPassword,
            });

            toast.success("Password berhasil diubah", {
                description: `Password untuk ${userName} telah diperbarui`,
            });

            setIsPasswordDialogOpen(false);
            setNewPassword("");
            setConfirmPassword("");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal mengubah password pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setIsLoading(true);
        try {
            await authClient.admin.removeUser({
                userId,
            });

            toast.success("Pengguna berhasil dihapus", {
                description: `${userName} telah dihapus dari sistem`,
            });

            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menghapus pengguna",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenLinkDialog = async () => {
        setIsLinkDialogOpen(true);
        setIsLoadingSubmissions(true);
        try {
            const response = await fetch("/api/admin/submissions/unlinked");
            const data = await response.json();

            if (response.ok) {
                setUnlinkedSubmissions(data.submissions || []);
            } else {
                toast.error("Gagal memuat pengajuan", {
                    description: data.error || "Silakan coba lagi",
                });
            }
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal memuat daftar pengajuan",
            });
        } finally {
            setIsLoadingSubmissions(false);
        }
    };

    const handleLinkSubmission = async () => {
        if (!selectedSubmissionId) {
            toast.error("Pilih pengajuan terlebih dahulu");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/users/link-submission", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    submissionId: selectedSubmissionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error("Gagal menghubungkan pengajuan", {
                    description: data.error || "Silakan coba lagi",
                });
                return;
            }

            toast.success("Pengajuan berhasil dihubungkan", {
                description: `Pengajuan telah dihubungkan dengan ${userName}`,
            });

            setIsLinkDialogOpen(false);
            setSelectedSubmissionId("");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal menghubungkan pengajuan",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlinkSubmission = async () => {
        if (!submissionId) {
            toast.error("Tidak ada pengajuan yang terhubung");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/users/unlink-submission", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    submissionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error("Gagal memutus hubungan pengajuan", {
                    description: data.error || "Silakan coba lagi",
                });
                return;
            }

            toast.success("Pengajuan berhasil diputus", {
                description: `Pengajuan telah diputus dari ${userName}`,
            });

            setIsUnlinkDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan", {
                description: "Gagal memutus hubungan pengajuan",
            });
        } finally {
            setIsLoading(false);
        }
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
                    <DropdownMenuItem
                        onClick={() => setIsUpdateDialogOpen(true)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Pengguna
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsPasswordDialogOpen(true)}
                    >
                        <Key className="mr-2 h-4 w-4" />
                        Ubah Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Ubah Role
                    </DropdownMenuItem>
                    {!hasSubmission && (
                        <DropdownMenuItem onClick={handleOpenLinkDialog}>
                            <Link2 className="mr-2 h-4 w-4" />
                            Link Pengajuan
                        </DropdownMenuItem>
                    )}
                    {hasSubmission && (
                        <DropdownMenuItem
                            onClick={() => setIsUnlinkDialogOpen(true)}
                            className="text-orange-600 focus:text-orange-600"
                        >
                            <Unlink className="mr-2 h-4 w-4" />
                            Putus Hubungan Pengajuan
                        </DropdownMenuItem>
                    )}
                    {isBanned ? (
                        <DropdownMenuItem onClick={handleUnbanUser}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Buka Blokir
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={handleBanUser}>
                            <UserX className="mr-2 h-4 w-4" />
                            Blokir Pengguna
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Pengguna
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update User Dialog */}
            <Dialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi pengguna. Perubahan akan langsung
                            diterapkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-name">Nama</Label>
                            <Input
                                id="update-name"
                                value={updateName}
                                onChange={(e) => setUpdateName(e.target.value)}
                                placeholder="Masukkan nama"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="update-email">Email</Label>
                            <Input
                                id="update-email"
                                type="email"
                                value={updateEmail}
                                onChange={(e) => setUpdateEmail(e.target.value)}
                                placeholder="Masukkan email"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsUpdateDialogOpen(false);
                                // Reset values
                                setUpdateName(userName);
                                setUpdateEmail(userEmail);
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleUpdateUser} disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Role Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Role Pengguna</DialogTitle>
                        <DialogDescription>
                            Ubah role untuk {userName}. Perubahan akan langsung
                            diterapkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRoleDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSetRole} disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Password Dialog */}
            <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Password Pengguna</DialogTitle>
                        <DialogDescription>
                            Ubah password untuk {userName}. Password minimal 8
                            karakter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Password Baru</Label>
                            <PasswordInput
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Masukkan password baru"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">
                                Konfirmasi Password
                            </Label>
                            <PasswordInput
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Konfirmasi password baru"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsPasswordDialogOpen(false);
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Pengguna</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus {userName}?
                            Tindakan ini tidak dapat dibatalkan.
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
                            onClick={handleDeleteUser}
                            disabled={isLoading}
                        >
                            {isLoading ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Link Submission Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Link Pengajuan ke Pengguna</DialogTitle>
                        <DialogDescription>
                            Pilih pengajuan yang akan dihubungkan dengan{" "}
                            {userName}. Hanya pengajuan yang belum terhubung
                            dengan pengguna lain yang ditampilkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {isLoadingSubmissions ? (
                            <div className="text-center text-sm text-muted-foreground">
                                Memuat daftar pengajuan...
                            </div>
                        ) : unlinkedSubmissions.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground">
                                Tidak ada pengajuan yang tersedia untuk di-link
                            </div>
                        ) : (
                            <Popover
                                open={isComboboxOpen}
                                onOpenChange={setIsComboboxOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isComboboxOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedSubmissionId
                                            ? (() => {
                                                  const sub =
                                                      unlinkedSubmissions.find(
                                                          (s) =>
                                                              s.id ===
                                                              selectedSubmissionId,
                                                      );
                                                  return sub
                                                      ? `${sub.namaDepan} ${sub.namaBelakang || ""} (${sub.namaAlias || "No alias"}) - NIK: ${sub.nik}`
                                                      : "Pilih pengajuan";
                                              })()
                                            : "Pilih pengajuan"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[460px] p-0">
                                    <div className="flex items-center border-b px-3">
                                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                        <Input
                                            placeholder="Cari pengajuan..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0"
                                        />
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto p-1">
                                        {unlinkedSubmissions.filter(
                                            (sub) =>
                                                sub.namaDepan
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase(),
                                                    ) ||
                                                (sub.namaBelakang &&
                                                    sub.namaBelakang
                                                        .toLowerCase()
                                                        .includes(
                                                            searchQuery.toLowerCase(),
                                                        )) ||
                                                (sub.namaAlias &&
                                                    sub.namaAlias
                                                        .toLowerCase()
                                                        .includes(
                                                            searchQuery.toLowerCase(),
                                                        )) ||
                                                sub.nik.includes(searchQuery),
                                        ).length === 0 ? (
                                            <div className="py-6 text-center text-sm text-muted-foreground">
                                                Tidak ada pengajuan ditemukan.
                                            </div>
                                        ) : (
                                            unlinkedSubmissions
                                                .filter(
                                                    (sub) =>
                                                        sub.namaDepan
                                                            .toLowerCase()
                                                            .includes(
                                                                searchQuery.toLowerCase(),
                                                            ) ||
                                                        (sub.namaBelakang &&
                                                            sub.namaBelakang
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchQuery.toLowerCase(),
                                                                )) ||
                                                        (sub.namaAlias &&
                                                            sub.namaAlias
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchQuery.toLowerCase(),
                                                                )) ||
                                                        sub.nik.includes(
                                                            searchQuery,
                                                        ),
                                                )
                                                .map((submission) => (
                                                    <div
                                                        key={submission.id}
                                                        className={cn(
                                                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                            selectedSubmissionId ===
                                                                submission.id &&
                                                                "bg-accent text-accent-foreground",
                                                        )}
                                                        onClick={() => {
                                                            setSelectedSubmissionId(
                                                                submission.id ===
                                                                    selectedSubmissionId
                                                                    ? ""
                                                                    : submission.id,
                                                            );
                                                            setIsComboboxOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedSubmissionId ===
                                                                    submission.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {submission.namaDepan}{" "}
                                                        {submission.namaBelakang ||
                                                            ""}{" "}
                                                        (
                                                        {submission.namaAlias ||
                                                            "No alias"}
                                                        ) - NIK:{" "}
                                                        {submission.nik} -{" "}
                                                        {submission.kota}
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsLinkDialogOpen(false);
                                setSelectedSubmissionId("");
                            }}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleLinkSubmission}
                            disabled={
                                isLoading ||
                                !selectedSubmissionId ||
                                unlinkedSubmissions.length === 0
                            }
                        >
                            {isLoading ? "Menghubungkan..." : "Link Pengajuan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unlink Submission Dialog */}
            <Dialog
                open={isUnlinkDialogOpen}
                onOpenChange={setIsUnlinkDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Putus Hubungan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin memutus hubungan pengajuan
                            dari {userName}? Pengajuan akan menjadi tidak
                            terhubung dengan akun pengguna manapun dan dapat
                            di-link ulang nanti.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUnlinkDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleUnlinkSubmission}
                            disabled={isLoading}
                        >
                            {isLoading ? "Memutus..." : "Putus Hubungan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
