import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function AdminLayoutSkeleton() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full">
            <div className="hidden lg:flex w-64 flex-col border-r bg-background p-4 gap-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="flex-1 p-4 lg:p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}

/**
 * Admin content component that handles auth check
 * This is wrapped in Suspense because it uses headers() which is request-specific
 */
async function AdminContent({ children }: { children: React.ReactNode }) {
    // Get session from server - this uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to home if not logged in or not admin
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    return (
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
    );
}

/**
 * Admin layout - wraps admin pages with sidebar and auth check
 * Uses Suspense to handle the request-specific headers() call
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<AdminLayoutSkeleton />}>
            <AdminContent>{children}</AdminContent>
        </Suspense>
    );
}
