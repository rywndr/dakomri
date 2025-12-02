import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Get current admin session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // Verify admin access
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized: Admin access required" },
                { status: 403 },
            );
        }

        // Parse request body
        const body = await req.json();
        const { userId, submissionId } = body;

        // Validate input
        if (!userId || !submissionId) {
            return NextResponse.json(
                { error: "userId and submissionId are required" },
                { status: 400 },
            );
        }

        // Check if user exists
        const [userExists] = await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!userExists) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        // Check if user already has a submission
        const [existingSubmission] = await db
            .select({ id: formSubmission.id })
            .from(formSubmission)
            .where(eq(formSubmission.userId, userId))
            .limit(1);

        if (existingSubmission) {
            return NextResponse.json(
                {
                    error: "User already has a linked submission",
                    existingSubmissionId: existingSubmission.id,
                },
                { status: 400 },
            );
        }

        // Check if submission exists and is unlinked
        const [submission] = await db
            .select({ id: formSubmission.id, userId: formSubmission.userId })
            .from(formSubmission)
            .where(
                and(
                    eq(formSubmission.id, submissionId),
                    isNull(formSubmission.userId),
                ),
            )
            .limit(1);

        if (!submission) {
            return NextResponse.json(
                {
                    error: "Submission not found or already linked to another user",
                },
                { status: 404 },
            );
        }

        // Link the submission to the user
        await db
            .update(formSubmission)
            .set({
                userId: userId,
                updatedAt: new Date(),
            })
            .where(eq(formSubmission.id, submissionId));

        return NextResponse.json(
            {
                success: true,
                message: "Submission successfully linked to user",
                userId,
                submissionId,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error linking submission to user:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat menghubungkan pengajuan",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
