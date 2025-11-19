"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and, or } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Server action untuk mendapatkan status form submission user
 * Menggunakan unstable_cache dengan revalidate 5 menit
 */
export async function getFormStatus() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {
            hasSubmitted: false,
            status: null,
        };
    }

    // Fungsi untuk query database
    const fetchSubmissionStatus = async (userId: string) => {
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
            status: submission.status,
            submissionId: submission.id,
            createdAt: submission.createdAt,
            verifiedAt: submission.verifiedAt,
            rejectionReason: submission.rejectionReason,
        };
    };

    // Cache hasil query selama 5 menit
    const getCachedStatus = unstable_cache(
        fetchSubmissionStatus,
        [`form-status-${session.user.id}`],
        {
            tags: [`user-${session.user.id}`, "form-status"],
            revalidate: 300, // 5 menit
        },
    );

    return getCachedStatus(session.user.id);
}
