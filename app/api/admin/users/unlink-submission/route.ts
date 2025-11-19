import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        // Get admin session
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        // Verify
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

        // Check if submission exists and is linked to this user
        const [submission] = await db
            .select({ id: formSubmission.id, userId: formSubmission.userId })
            .from(formSubmission)
            .where(
                and(
                    eq(formSubmission.id, submissionId),
                    eq(formSubmission.userId, userId),
                ),
            )
            .limit(1);

        if (!submission) {
            return NextResponse.json(
                {
                    error: "Submission not found or not linked to this user",
                },
                { status: 404 },
            );
        }

        // Unlink the submission from the user (set userId to null)
        await db
            .update(formSubmission)
            .set({
                userId: null,
                updatedAt: new Date(),
            })
            .where(eq(formSubmission.id, submissionId));

        return NextResponse.json(
            {
                success: true,
                message: "Submission successfully unlinked from user",
                userId,
                submissionId,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error unlinking submission from user:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat memutus hubungan pengajuan",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
