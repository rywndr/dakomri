import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { SubmissionEditClient } from "@/components/admin/submission-edit-client";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SubmissionEditPage({ params }: PageProps) {
    // Check if user is authenticated and is an admin
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    const { id } = await params;

    // Fetch submission
    const [submission] = await db
        .select()
        .from(formSubmission)
        .where(eq(formSubmission.id, id))
        .limit(1);

    if (!submission) {
        notFound();
    }

    // Parse JSON fields ke array tuk form
    const submissionData: any = {
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
    };

    return (
        <div className="flex flex-1 flex-col gap-6 pb-8">
            <SubmissionEditClient initialData={submissionData} />
        </div>
    );
}
