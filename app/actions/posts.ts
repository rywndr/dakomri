"use server";

import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Helper function untuk generate slug dari title
 * @param title - Judul post
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
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized: User tidak terautentikasi");
    }

    // Cek apakah user adalah admin
    if (session.user.role !== "admin") {
        throw new Error("Forbidden: Hanya admin yang dapat melakukan aksi ini");
    }

    return session.user;
}

/**
 * Interface untuk create/update post
 */
export interface PostInput {
    title: string;
    content: string;
    published: "draft" | "published";
}

/**
 * Create post baru
 */
export async function createPost(input: PostInput) {
    try {
        const user = await validateAdmin();

        // Generate slug dari title
        let slug = generateSlug(input.title);
        let slugSuffix = 0;

        // Cek apakah slug sudah digunakan, jika ya tambahkan suffix
        while (true) {
            const testSlug = slugSuffix === 0 ? slug : `${slug}-${slugSuffix}`;
            const existing = await db
                .select()
                .from(posts)
                .where(eq(posts.slug, testSlug));

            if (existing.length === 0) {
                slug = testSlug;
                break;
            }
            slugSuffix++;
        }

        // Insert post baru
        const newPost = await db
            .insert(posts)
            .values({
                id: nanoid(),
                title: input.title,
                content: input.content,
                slug,
                published: input.published,
                createdBy: user.id,
                updatedBy: user.id,
            })
            .returning();

        // Revalidate halaman kegiatan
        revalidatePath("/kegiatan");

        return {
            success: true,
            post: newPost[0],
            message: "Post berhasil dibuat",
        };
    } catch (error) {
        console.error("Error creating post:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Gagal membuat post",
        };
    }
}

/**
 * Update post yang sudah ada
 */
export async function updatePost(id: string, input: PostInput) {
    try {
        const user = await validateAdmin();

        // Cek apakah post exists
        const existing = await db.select().from(posts).where(eq(posts.id, id));

        if (existing.length === 0) {
            throw new Error("Post tidak ditemukan");
        }

        // Generate slug baru jika title berubah
        let slug = existing[0].slug;
        if (input.title !== existing[0].title) {
            slug = generateSlug(input.title);
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
        const updatedPost = await db
            .update(posts)
            .set({
                title: input.title,
                content: input.content,
                slug,
                published: input.published,
                updatedBy: user.id,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        // Revalidate halaman kegiatan
        revalidatePath("/kegiatan");

        return {
            success: true,
            post: updatedPost[0],
            message: "Post berhasil diupdate",
        };
    } catch (error) {
        console.error("Error updating post:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal mengupdate post",
        };
    }
}

/**
 * Delete post
 */
export async function deletePost(id: string) {
    try {
        await validateAdmin();

        // Cek apakah post exists
        const existing = await db.select().from(posts).where(eq(posts.id, id));

        if (existing.length === 0) {
            throw new Error("Post tidak ditemukan");
        }

        // Delete post
        await db.delete(posts).where(eq(posts.id, id));

        // Revalidate halaman kegiatan
        revalidatePath("/kegiatan");

        return {
            success: true,
            message: "Post berhasil dihapus",
        };
    } catch (error) {
        console.error("Error deleting post:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Gagal menghapus post",
        };
    }
}

/**
 * Toggle status publikasi post
 */
export async function togglePublishStatus(id: string) {
    try {
        const user = await validateAdmin();

        // Cek apakah post exists
        const existing = await db.select().from(posts).where(eq(posts.id, id));

        if (existing.length === 0) {
            throw new Error("Post tidak ditemukan");
        }

        const currentStatus = existing[0].published;
        const newStatus = currentStatus === "published" ? "draft" : "published";

        // Update status
        const updatedPost = await db
            .update(posts)
            .set({
                published: newStatus,
                updatedBy: user.id,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        // Revalidate halaman kegiatan
        revalidatePath("/kegiatan");

        return {
            success: true,
            post: updatedPost[0],
            message: `Post berhasil di${newStatus === "published" ? "publikasikan" : "draft"}`,
        };
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Gagal mengubah status publikasi",
        };
    }
}

/**
 * Get post by ID
 * Server action untuk fetch post detail
 */
export async function getPostByIdAction(id: string) {
    try {
        await validateAdmin();

        const result = await db.select().from(posts).where(eq(posts.id, id));

        if (result.length === 0) {
            return {
                success: false,
                error: "Post tidak ditemukan",
                post: null,
            };
        }

        return {
            success: true,
            post: result[0],
        };
    } catch (error) {
        console.error("Error fetching post:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Gagal memuat post",
            post: null,
        };
    }
}
