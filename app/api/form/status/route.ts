import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and, or } from "drizzle-orm";

// Revalidate cache setiap 5 menit (300 detik)
export const revalidate = 300;

/**
 * GET /api/form/status
 * Get the current user's form submission status
 * Cached for 5 minutes to reduce database load
 */
export async function GET(req: NextRequest) {
    try {
        // Get current user session
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    hasSubmitted: false,
                    status: null,
                    message: "User not authenticated",
                },
                { status: 200 },
            );
        }

        // Cache query result untuk mengurangi load database
        const getCachedSubmissionStatus = unstable_cache(
            async (userId: string) => {
                return await db
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
            },
            [`form-status-${session.user.id}`],
            {
                tags: [`user-${session.user.id}`, "form-status"],
                revalidate: 300, // 5 menit
            },
        );

        const submissions = await getCachedSubmissionStatus(session.user.id);

        if (submissions.length === 0) {
            return NextResponse.json(
                {
                    hasSubmitted: false,
                    status: null,
                },
                { status: 200 },
            );
        }

        const submission = submissions[0];

        return NextResponse.json(
            {
                hasSubmitted: true,
                status: submission.status,
                submissionId: submission.id,
                createdAt: submission.createdAt,
                verifiedAt: submission.verifiedAt,
                rejectionReason: submission.rejectionReason,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Form status check error:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat mengecek status formulir",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
