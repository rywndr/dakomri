"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LogOutIcon,
    ShieldIcon,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
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
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
        hasSubmitted: false,
        status: null,
    });

    /**
     * Fetch user's form submission status
     */
    useEffect(() => {
        if (session?.user) {
            fetch("/api/form/status")
                .then((res) => res.json())
                .then((data) => {
                    setSubmissionStatus({
                        hasSubmitted: data.hasSubmitted || false,
                        status: data.status || null,
                    });
                })
                .catch((error) => {
                    console.error("Failed to fetch submission status:", error);
                });
        }
    }, [session]);

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
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <FileText className="mr-2 size-4" />
                    <span className="flex-1">Status Form</span>
                    {submissionStatus.hasSubmitted ? (
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
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOutIcon className="mr-2 size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
