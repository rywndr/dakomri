import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { SubmissionEditClient } from "@/components/admin/submission-edit-client";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

function EditPageSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-6 pb-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

/**
 * Server component untuk authenticated edit content
 * Wrapped in Suspense karena menggunakan headers()
 */
async function AuthenticatedEditContent({ id }: { id: string }) {
    // Check if user is authenticated and is an admin - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    // Fetch submission
    const [submission] = await db
        .select()
        .from(formSubmission)
        .where(eq(formSubmission.id, id))
        .limit(1);

    if (!submission) {
        notFound();
    }

    // Parse JSON fields ke array untuk form
    const submissionData = {
        ...submission,
        jenisPelatihanDiikuti: submission.jenisPelatihanDiikuti
            ? JSON.parse(submission.jenisPelatihanDiikuti)
            : [],
        penyelenggaraPelatihan: submission.penyelenggaraPelatihan
            ? JSON.parse(submission.penyelenggaraPelatihan)
            : [],
        pelatihanDiinginkan: submission.pelatihanDiinginkan
            ? JSON.parse(submission.pelatihanDiinginkan)
            : [],
        jenisDisabilitas: submission.jenisDisabilitas
            ? JSON.parse(submission.jenisDisabilitas)
            : [],
        jenisDiskriminasi: submission.jenisDiskriminasi
            ? JSON.parse(submission.jenisDiskriminasi)
            : [],
        pelakuDiskriminasi: submission.pelakuDiskriminasi
            ? JSON.parse(submission.pelakuDiskriminasi)
            : [],
        lokasiKejadian: submission.lokasiKejadian
            ? JSON.parse(submission.lokasiKejadian)
            : [],
        bantuanSosialLainnya: submission.bantuanSosialLainnya
            ? JSON.parse(submission.bantuanSosialLainnya)
            : [],
        pendapatanBulanan: submission.pendapatanBulanan
            ? Number(submission.pendapatanBulanan)
            : undefined,
    } as Parameters<typeof SubmissionEditClient>[0]["initialData"];

    return (
        <div className="flex flex-1 flex-col gap-6 pb-8">
            <SubmissionEditClient initialData={submissionData} />
        </div>
    );
}

/**
 * Halaman Edit Submission untuk Admin
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 */
export default async function SubmissionEditPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<EditPageSkeleton />}>
            <AuthenticatedEditContent id={id} />
        </Suspense>
    );
}
