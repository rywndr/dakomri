import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { isNull, desc } from "drizzle-orm";

export async function GET() {
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

        // Query submissions where userId is null
        const unlinkedSubmissions = await db
            .select({
                id: formSubmission.id,
                namaDepan: formSubmission.namaDepan,
                namaBelakang: formSubmission.namaBelakang,
                namaAlias: formSubmission.namaAlias,
                nik: formSubmission.nik,
                kota: formSubmission.kota,
                kontakTelp: formSubmission.kontakTelp,
                status: formSubmission.status,
                createdAt: formSubmission.createdAt,
                createdBy: formSubmission.createdBy,
            })
            .from(formSubmission)
            .where(isNull(formSubmission.userId))
            .orderBy(desc(formSubmission.createdAt));

        return NextResponse.json(
            {
                success: true,
                submissions: unlinkedSubmissions,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching unlinked submissions:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat mengambil data",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
