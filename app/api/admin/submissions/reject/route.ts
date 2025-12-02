import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
    revalidateFormStatus,
    revalidateSubmissions,
    revalidateSubmissionStats,
    revalidateStatistics,
} from "@/lib/revalidate";

export async function POST(request: NextRequest) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Check if user is authenticated and is an admin
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Parse request body
        const body = await request.json();
        const { submissionId, rejectionReason, adminNotes } = body;

        // Validate required fields
        if (!submissionId || !rejectionReason) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check if submission exists
        const [existingSubmission] = await db
            .select()
            .from(formSubmission)
            .where(eq(formSubmission.id, submissionId))
            .limit(1);

        if (!existingSubmission) {
            return NextResponse.json(
                { error: "Submission not found" },
                { status: 404 },
            );
        }

        if (
            existingSubmission.status !== "submitted" &&
            existingSubmission.status !== "verified"
        ) {
            return NextResponse.json(
                {
                    error: "Only submitted or verified submissions can be rejected",
                },
                { status: 400 },
            );
        }

        // Update submission ke rejected
        const [updatedSubmission] = await db
            .update(formSubmission)
            .set({
                status: "rejected",
                rejectionReason: rejectionReason,
                adminNotes: adminNotes || null,
                verifiedBy: session.user.id,
                verifiedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(formSubmission.id, submissionId))
            .returning();

        // Revalidate caches setelah rejection
        // 1. Revalidate form status untuk user terkait
        if (existingSubmission.userId) {
            await revalidateFormStatus(existingSubmission.userId);
        }
        // 2. Revalidate admin submissions cache
        await revalidateSubmissions();
        // 3. Revalidate submission stats (pending/approved/rejected counts)
        await revalidateSubmissionStats();
        // 4. Revalidate statistics karena data berubah
        await revalidateStatistics();
        // 5. Revalidate the submissions page path
        revalidatePath("/admin/submissions");

        return NextResponse.json(
            {
                success: true,
                submission: updatedSubmission,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error rejecting submission:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
