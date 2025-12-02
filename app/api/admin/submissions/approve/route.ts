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
        const { submissionId, adminNotes } = body;

        // Validate required fields
        if (!submissionId) {
            return NextResponse.json(
                { error: "Missing submission ID" },
                { status: 400 },
            );
        }

        // Check if submission exists and is in submitted status
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

        if (existingSubmission.status !== "submitted") {
            return NextResponse.json(
                {
                    error: "Only submitted submissions can be approved",
                },
                { status: 400 },
            );
        }

        // Update submission ke verified
        const [updatedSubmission] = await db
            .update(formSubmission)
            .set({
                status: "verified",
                verifiedBy: session.user.id,
                verifiedAt: new Date(),
                adminNotes: adminNotes || null,
                rejectionReason: null,
                updatedAt: new Date(),
            })
            .where(eq(formSubmission.id, submissionId))
            .returning();

        // Revalidate caches setelah approval
        // 1. Revalidate form status untuk user terkait
        if (existingSubmission.userId) {
            await revalidateFormStatus(existingSubmission.userId);
        }
        // 2. Revalidate admin submissions cache
        await revalidateSubmissions();
        // 3. Revalidate statistics karena data berubah
        await revalidateStatistics();
        // 4. Revalidate the submissions page path
        revalidatePath("/admin/submissions");

        return NextResponse.json(
            {
                success: true,
                submission: updatedSubmission,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error approving submission:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
