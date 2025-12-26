import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SubmissionEntryWrapper } from "@/components/admin/submission-entry/submission-entry-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

function BuatPengajuanSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Server component untuk authenticated buat pengajuan content
 * Wrapped in Suspense karena menggunakan headers()
 */
async function AuthenticatedBuatPengajuanContent() {
    // Get admin status - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return <SubmissionEntryWrapper />;
}

/**
 * Halaman Buat Pengajuan untuk Admin
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 */
export default function BuatPengajuanPage() {
    return (
        <Suspense fallback={<BuatPengajuanSkeleton />}>
            <AuthenticatedBuatPengajuanContent />
        </Suspense>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Buat Pengajuan | Admin DAKOMRI",
    description: "Halaman admin untuk membuat pengajuan",
};
