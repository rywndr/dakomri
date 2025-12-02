import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";

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

/**
 * hared across all non-auth routes
 */
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
            </Suspense>
            {children}
        </>
    );
}
