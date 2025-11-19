"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFormStatus } from "@/app/actions/form-status";
import {
    LogOutIcon,
    ShieldIcon,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getInitials, getRoleBadgeColor } from "@/lib/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Session } from "@/lib/auth";

interface UserMenuProps {
    session: Session | null;
}

interface SubmissionStatus {
    hasSubmitted: boolean;
    status: string | null;
}

export function UserMenu({ session }: UserMenuProps) {
    const router = useRouter();

    /**
     * Fetch user's form submission status dengan React Query caching
     * Cache selama 5 menit untuk mengurangi database load
     * Menggunakan server action yang sudah di-cache di server side
     */
    const { data: submissionStatus, isLoading } = useQuery({
        queryKey: ["formStatus"],
        queryFn: () => getFormStatus(),
        enabled: !!session?.user,
        staleTime: 5 * 60 * 1000, // 5 menit - data dianggap fresh
        gcTime: 10 * 60 * 1000, // 10 menit - cache cleanup time
        refetchOnWindowFocus: false, // Jangan refetch saat window focus
        refetchOnMount: false, // Jangan refetch saat component mount jika data masih fresh
        refetchOnReconnect: false, // Jangan refetch saat reconnect
        networkMode: "offlineFirst", // Prioritaskan cache
    });

    /**
     * Handle logout user
     */
    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Berhasil logout");
                        // Refresh to update server component
                        router.push("/auth");
                        router.refresh();
                    },
                },
            });
        } catch {
            toast.error("Terjadi kesalahan saat logout");
        }
    };

    // Not logged in
    if (!session) {
        return (
            <Link href="/auth">
                <button className="py-2 px-2 rounded-md text-sm font-medium bg-black text-white hover:opacity-80 transition-opacity">
                    Sign In
                </button>
            </Link>
        );
    }

    // Logged in
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-[3px] focus-visible:outline-1">
                    <Avatar className="size-9 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage
                            src={session.user.image || undefined}
                            alt={session.user.name || "User"}
                        />
                        <AvatarFallback>
                            {getInitials(session.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">
                            {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2 size-4" />
                        <span>Profil</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOutIcon className="mr-2 size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <ShieldIcon className="mr-2 size-4" />
                    <span className="flex-1">Role</span>
                    <span
                        className={`text-xs font-medium uppercase ${getRoleBadgeColor(
                            session.user.role ?? undefined,
                        )}`}
                    >
                        {session.user.role ?? "user"}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <FileText className="mr-2 size-4" />
                    <span className="flex-1">Status Form</span>
                    {isLoading ? (
                        <span className="text-xs text-muted-foreground">
                            Loading...
                        </span>
                    ) : submissionStatus?.hasSubmitted ? (
                        <div className="flex items-center gap-1">
                            {submissionStatus.status === "submitted" && (
                                <>
                                    <Clock className="size-3 text-yellow-500" />
                                    <span className="text-xs text-yellow-600">
                                        Menunggu
                                    </span>
                                </>
                            )}
                            {submissionStatus.status === "verified" && (
                                <>
                                    <CheckCircle2 className="size-3 text-green-500" />
                                    <span className="text-xs text-green-600">
                                        Terverifikasi
                                    </span>
                                </>
                            )}
                            {submissionStatus.status === "rejected" && (
                                <>
                                    <XCircle className="size-3 text-red-500" />
                                    <span className="text-xs text-red-600">
                                        Ditolak
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            Belum Submit
                        </span>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
