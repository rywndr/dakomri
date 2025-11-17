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
        const { submissionId } = body;

        // Validate required fields
        if (!submissionId) {
            return NextResponse.json(
                { error: "Missing submission ID" },
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

        // Delete submission
        const [deletedSubmission] = await db
            .delete(formSubmission)
            .where(eq(formSubmission.id, submissionId))
            .returning();

        return NextResponse.json(
            {
                success: true,
                submission: deletedSubmission,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting submission:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
