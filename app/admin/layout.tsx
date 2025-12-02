import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for navbar loading state during prerender
 */
function NavbarSkeleton() {
    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Skeleton className="size-9 md:hidden" />
                <div className="flex items-center gap-3">
                    <Skeleton className="size-[38px] rounded" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="hidden md:flex items-center gap-1">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-14" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="size-9 rounded-full" />
            </div>
        </nav>
    );
}

function AdminLayoutSkeleton() {
    return (
        <>
            <NavbarSkeleton />
            <div className="flex min-h-[calc(100vh-4rem)]">
                <div className="hidden lg:flex w-64 border-r">
                    <div className="p-4 space-y-4 w-full">
                        <Skeleton className="h-8 w-32" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 p-4 lg:p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <div className="grid gap-4 md:grid-cols-3 mt-6">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Server component untuk authenticated admin layout content
 * Wrapped in Suspense karena menggunakan headers()
 */
async function AuthenticatedAdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get session from server - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to home if not logged in or not admin
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <>
            <Navbar />
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset className="flex-1">
                    {/* Header dengan mobile trigger */}
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-6" />
                        <h1 className="text-lg font-semibold">Admin Panel</h1>
                    </header>

                    {/* Main content */}
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

/**
 * Admin Layout
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<AdminLayoutSkeleton />}>
            <AuthenticatedAdminLayoutContent>
                {children}
            </AuthenticatedAdminLayoutContent>
        </Suspense>
    );
}
