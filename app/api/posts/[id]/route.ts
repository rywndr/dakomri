import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePosts, revalidatePost } from "@/lib/revalidate";

/**
 * Helper function untuk generate slug dari title
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Hapus karakter spesial
        .replace(/[\s_-]+/g, "-") // Replace spaces dan underscore dengan dash
        .replace(/^-+|-+$/g, ""); // Hapus dash di awal/akhir
}

/**
 * Helper function untuk validasi admin
 */
async function validateAdmin() {
    // Opt into dynamic rendering
    await connection();

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
 * PUT /api/posts/[id]
 * Update a post by ID
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { error, user } = await validateAdmin();
        if (error || !user) {
            return NextResponse.json(
                { error: error || "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { title, content, published } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 },
            );
        }

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

        // Generate slug baru jika title berubah
        let slug = existing.slug;
        if (title !== existing.title) {
            slug = generateSlug(title);
            let slugSuffix = 0;

            // Cek apakah slug sudah digunakan (exclude post yang sedang diedit)
            while (true) {
                const testSlug =
                    slugSuffix === 0 ? slug : `${slug}-${slugSuffix}`;
                const duplicates = await db
                    .select()
                    .from(posts)
                    .where(eq(posts.slug, testSlug));

                // Jika tidak ada duplicate atau duplicate adalah post ini sendiri
                if (
                    duplicates.length === 0 ||
                    (duplicates.length === 1 && duplicates[0].id === id)
                ) {
                    slug = testSlug;
                    break;
                }
                slugSuffix++;
            }
        }

        // Update post
        const [updatedPost] = await db
            .update(posts)
            .set({
                title,
                content,
                slug,
                published: published || existing.published,
                updatedBy: user.id,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        // Revalidate specific post dan posts list
        await revalidatePost(id);
        revalidatePath("/kegiatan");
        revalidatePath(`/kegiatan/${slug}`);
        revalidatePath("/admin/kegiatan");

        return NextResponse.json(
            {
                success: true,
                post: updatedPost,
                message: "Post berhasil diupdate",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post by ID
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

        // Delete post
        await db.delete(posts).where(eq(posts.id, id));

        // Revalidate posts cache
        await revalidatePosts();
        revalidatePath("/kegiatan");
        revalidatePath("/admin/kegiatan");

        return NextResponse.json(
            {
                success: true,
                message: "Post berhasil dihapus",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
