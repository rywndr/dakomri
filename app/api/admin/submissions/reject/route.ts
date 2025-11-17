import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
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
