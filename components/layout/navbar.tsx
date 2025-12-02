"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOutIcon, ShieldIcon, FileText, User } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import Logo from "@/public/pkbi.png";

interface UserSession {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
}

interface FormStatus {
    hasSubmitted: boolean;
    status: "submitted" | "verified" | "rejected" | null;
}

/**
 * Fetch user session from API
 */
async function fetchSession(): Promise<UserSession | null> {
    const response = await fetch("/api/user/session");
    if (!response.ok) return null;
    const data = await response.json();
    return data.user || null;
}

/**
 * Fetch form status from API
 */
async function fetchFormStatus(): Promise<FormStatus> {
    const response = await fetch("/api/form/status");
    if (!response.ok) return { hasSubmitted: false, status: null };
    return response.json();
}

/**
 * FormStatusBadge - Displays the user's form submission status
 */
function FormStatusBadge({ status }: { status: FormStatus }) {
    if (!status.hasSubmitted) {
        return (
            <span className="text-xs text-muted-foreground">Belum Submit</span>
        );
    }

    if (status.status === "submitted") {
        return <span className="text-xs text-yellow-600">Menunggu</span>;
    }

    if (status.status === "verified") {
        return <span className="text-xs text-green-600">Terverifikasi</span>;
    }

    if (status.status === "rejected") {
        return <span className="text-xs text-red-600">Ditolak</span>;
    }

    return <span className="text-xs text-muted-foreground">Belum Submit</span>;
}

/**
 * UserMenu - Dropdown menu for authenticated users
 */
function UserMenu({ user }: { user: UserSession }) {
    const router = useRouter();

    const { data: formStatus, isLoading: isLoadingStatus } = useQuery({
        queryKey: ["form-status"],
        queryFn: fetchFormStatus,
        staleTime: 1000 * 30, // 30 seconds - shorter for more responsive updates
        refetchOnWindowFocus: true, // Refetch when user focuses window
    });

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Berhasil logout");
                        router.push("/auth");
                        router.refresh();
                    },
                },
            });
        } catch {
            toast.error("Terjadi kesalahan saat logout");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-[3px] focus-visible:outline-1">
                    <Avatar className="size-9 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage
                            src={user.image || undefined}
                            alt={user.name || "User"}
                        />
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">
                            {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-none">
                            {user.email}
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
                            user.role ?? undefined,
                        )}`}
                    >
                        {user.role ?? "user"}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <FileText className="mr-2 size-4" />
                    <span className="flex-1">Status Form</span>
                    {isLoadingStatus ? (
                        <Skeleton className="h-3 w-16" />
                    ) : (
                        <FormStatusBadge
                            status={
                                formStatus || {
                                    hasSubmitted: false,
                                    status: null,
                                }
                            }
                        />
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Navbar - Main navigation component
 * Uses TanStack Query for session and form status
 */
export function Navbar() {
    // Use isLoading from query to handle hydration - no need for separate mounted state
    const { data: session, isLoading } = useQuery({
        queryKey: ["session"],
        queryFn: fetchSession,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
    });

    const isAdmin = session?.role === "admin";

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Mobile Nav Toggle */}
                <MobileNav isAdmin={isAdmin} />

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 font-bold text-lg hover:opacity-80 transition-opacity"
                >
                    <Image
                        src={Logo}
                        alt="PKBI Logo"
                        width={38}
                        height={38}
                        className="object-contain"
                    />
                    <span className="relative">
                        DAKOMRI
                        <span className="absolute -top-1 -right-3 text-[0.65rem]">
                            ©
                        </span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <NavLinks isAdmin={isAdmin} />

                {/* User Menu / Auth Button */}
                <div className="flex items-center">
                    {isLoading ? (
                        <Skeleton className="size-9 rounded-full" />
                    ) : session ? (
                        <UserMenu user={session} />
                    ) : (
                        <Link href="/auth">
                            <button className="py-2 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
