import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and, or } from "drizzle-orm";

/**
 * GET /api/form/status
 * Get the current user's form submission status
 */
export async function GET() {
    await connection();

    try {
        // Get current user session
        const session = await auth.api.getSession({
            headers: await headers(),
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

        // Query for any submission by this user that is not a draft
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
                    eq(formSubmission.userId, session.user.id),
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
