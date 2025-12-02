import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * Tipe data untuk status form submission
 */
export interface FormStatusData {
    hasSubmitted: boolean;
    status: "submitted" | "verified" | "rejected" | null;
    submissionId?: string;
    createdAt?: Date;
    verifiedAt?: Date | null;
    rejectionReason?: string | null;
}

/**
 * Fetch status form submission user dengan caching
 * Cache di-tag dengan userId untuk revalidation yang targeted
 * Menggunakan cacheLife 'minutes' - revalidate setiap 1 menit
 *
 * @param userId - ID user yang akan dicek statusnya
 */
export async function getCachedFormStatus(
    userId: string,
): Promise<FormStatusData> {
    "use cache";
    cacheLife("minutes");
    cacheTag(`form-status-${userId}`, "form-status");

    const submissions = await db
        .select({
            id: formSubmission.id,
            status: formSubmission.status,
            createdAt: formSubmission.createdAt,
            verifiedAt: formSubmission.verifiedAt,
            rejectionReason: formSubmission.rejectionReason,
        })
        .from(formSubmission)
        .where(
            and(
                eq(formSubmission.userId, userId),
                or(
                    eq(formSubmission.status, "submitted"),
                    eq(formSubmission.status, "verified"),
                    eq(formSubmission.status, "rejected"),
                ),
            ),
        )
        .orderBy(formSubmission.createdAt)
        .limit(1);

    if (submissions.length === 0) {
        return {
            hasSubmitted: false,
            status: null,
        };
    }

    const submission = submissions[0];
    return {
        hasSubmitted: true,
        status: submission.status as "submitted" | "verified" | "rejected",
        submissionId: submission.id,
        createdAt: submission.createdAt,
        verifiedAt: submission.verifiedAt,
        rejectionReason: submission.rejectionReason,
    };
}

/**
 * Tipe data untuk info user di navbar
 */
export interface UserNavInfo {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
}

/**
 * Cache untuk user info yang ditampilkan di navbar
 * Di-tag untuk revalidation saat user update profile
 *
 * @param userId - ID user
 * @param name - Nama user
 * @param email - Email user
 * @param image - URL gambar profil user
 * @param role - Role user (admin/user)
 */
export async function getCachedUserNavInfo(
    userId: string,
    name: string | null,
    email: string,
    image: string | null,
    role: string | null,
): Promise<UserNavInfo> {
    "use cache";
    cacheLife("minutes");
    cacheTag(`user-info-${userId}`, "user-info");

    return {
        id: userId,
        name,
        email,
        image,
        role,
    };
}
