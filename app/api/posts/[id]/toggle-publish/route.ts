import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePost } from "@/lib/revalidate";

/**
 * Helper function untuk validasi admin
 */
async function validateAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "Unauthorized: User tidak terautentikasi", user: null };
    }

    if (session.user.role !== "admin") {
        return {
            error: "Forbidden: Hanya admin yang dapat melakukan aksi ini",
            user: null,
        };
    }

    return { error: null, user: session.user };
}

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * POST /api/posts/[id]/toggle-publish
 * Toggle the publish status of a post
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
    // Opt into dynamic rendering
    await connection();

    try {
        const { error, user } = await validateAdmin();
        if (error || !user) {
            return NextResponse.json(
                { error: error || "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        // Cek apakah post exists
        const [existing] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: "Post tidak ditemukan" },
                { status: 404 },
            );
        }

        const currentStatus = existing.published;
        const newStatus = currentStatus === "published" ? "draft" : "published";

        // Update status
        const [updatedPost] = await db
            .update(posts)
            .set({
                published: newStatus,
                updatedBy: user.id,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        // Revalidate specific post dan posts list
        await revalidatePost(id);
        revalidatePath("/kegiatan");
        revalidatePath(`/kegiatan/${existing.slug}`);
        revalidatePath("/admin/kegiatan");

        return NextResponse.json(
            {
                success: true,
                post: updatedPost,
                message: `Post berhasil di${newStatus === "published" ? "publikasikan" : "draft"}`,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
