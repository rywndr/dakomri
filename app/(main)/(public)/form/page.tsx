import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FormClient } from "@/components/form/form-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SectionHeaderSkeleton() {
    return (
        <div className="space-y-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
    );
}

function FormFieldsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    );
}

function SectionSkeleton({
    fieldCount = 4,
    showSeparator = true,
}: {
    fieldCount?: number;
    showSeparator?: boolean;
}) {
    return (
        <>
            <div className="space-y-6">
                <SectionHeaderSkeleton />
                <FormFieldsSkeleton count={fieldCount} />
            </div>
            {showSeparator && <Separator />}
        </>
    );
}

function FormSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full max-w-xl" />
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Section 1: Data Pribadi - 8 fields */}
                    <SectionSkeleton fieldCount={8} />

                    {/* Section 2: Dokumen Kependudukan - 3 fields */}
                    <SectionSkeleton fieldCount={3} />

                    {/* Section 3: Alamat - 7 fields */}
                    <SectionSkeleton fieldCount={7} />

                    {/* Section 4: Kontak - 1 field */}
                    <SectionSkeleton fieldCount={1} />

                    {/* Section 5: Pekerjaan & Ekonomi - 7 fields */}
                    <SectionSkeleton fieldCount={7} />

                    {/* Section 6: Pelatihan - 4 fields */}
                    <SectionSkeleton fieldCount={4} />

                    {/* Section 7: Jaminan Sosial - 2 fields */}
                    <SectionSkeleton fieldCount={2} />

                    {/* Section 8: Kesehatan - 3 fields */}
                    <SectionSkeleton fieldCount={3} />

                    {/* Section 9: Disabilitas - 2 fields */}
                    <SectionSkeleton fieldCount={2} />

                    {/* Section 10: Diskriminasi - 5 fields */}
                    <SectionSkeleton fieldCount={5} />

                    {/* Section 11: Bantuan Sosial - 4 fields */}
                    <SectionSkeleton fieldCount={4} showSeparator={false} />

                    {/* Submit button */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Skeleton className="h-10 flex-1" />
                    </div>

                    {/* Info note */}
                    <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Server component untuk authenticated form content
 * Wrapped in Suspense karena menggunakan headers()
 * FormClient handles its own status fetching via TanStack Query
 */
async function AuthenticatedFormContent() {
    // Get session - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to auth if not logged in
    if (!session?.user) {
        redirect("/auth");
    }

    // FormClient fetches form status via TanStack Query
    // This keeps it in sync with the navbar status
    return <FormClient />;
}

/**
 * Halaman Form Pendataan
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 * Form status di-fetch via TanStack Query di client untuk real-time sync
 */
export default function FormPage() {
    return (
        <Suspense fallback={<FormSkeleton />}>
            <AuthenticatedFormContent />
        </Suspense>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Formulir | DAKOMRI",
    description: "Formulir pengajuan komunitas waria di wilayah Bintan Raya",
};
