"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { useEffect, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

export function Navbar() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [submissionStatus, setSubmissionStatus] = useState<{
        hasSubmitted: boolean;
        status: string | null;
    }>({ hasSubmitted: false, status: null });

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
                        router.push("/auth");
                    },
                },
            });
        } catch {
            toast.error("Terjadi kesalahan saat logout");
        }
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="flex items-center font-bold text-lg hover:opacity-80 transition-opacity"
                    >
                        <div className="size-18 relative">
                            <Image
                                src="/pkbi.svg"
                                alt="PKBI Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span>DAKOMRI</span>
                    </Link>
                </div>

                {/* Navigation links */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/"
                                className={navigationMenuTriggerStyle()}
                            >
                                Home
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/statistics"
                                className={navigationMenuTriggerStyle()}
                            >
                                Statistik
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/form"
                                className={navigationMenuTriggerStyle()}
                            >
                                Form
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/kegiatan"
                                className={navigationMenuTriggerStyle()}
                            >
                                Kegiatan
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        {session?.user?.role === "admin" && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/admin"
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Admin
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* User avatar dengan dropdown */}
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-[3px] focus-visible:outline-1">
                                <Avatar className="size-9 cursor-pointer hover:opacity-80 transition-opacity">
                                    <AvatarImage
                                        src={session.user?.image || undefined}
                                        alt={session.user?.name || "User"}
                                    />
                                    <AvatarFallback>
                                        {getInitials(session.user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        {session.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-none">
                                        {session.user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <ShieldIcon className="mr-2 size-4" />
                                <span className="flex-1">Role</span>
                                <span
                                    className={`text-xs font-medium uppercase ${getRoleBadgeColor(
                                        session.user?.role ?? undefined,
                                    )}`}
                                >
                                    {session.user?.role ?? "user"}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <FileText className="mr-2 size-4" />
                                <span className="flex-1">Status Form</span>
                                {submissionStatus.hasSubmitted ? (
                                    <div className="flex items-center gap-1">
                                        {submissionStatus.status ===
                                            "submitted" && (
                                            <>
                                                <Clock className="size-3 text-yellow-500" />
                                                <span className="text-xs text-yellow-600">
                                                    Menunggu
                                                </span>
                                            </>
                                        )}
                                        {submissionStatus.status ===
                                            "verified" && (
                                            <>
                                                <CheckCircle2 className="size-3 text-green-500" />
                                                <span className="text-xs text-green-600">
                                                    Terverifikasi
                                                </span>
                                            </>
                                        )}
                                        {submissionStatus.status ===
                                            "rejected" && (
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
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={handleLogout}
                            >
                                <LogOutIcon className="mr-2 size-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href="/auth">
                        <button className="py-2 px-2 rounded-md text-sm font-medium bg-black text-white hover:opacity-80 transition-opacity">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
