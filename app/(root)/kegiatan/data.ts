import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { desc, ilike, or, eq, and } from "drizzle-orm";

export interface PaginatedPosts {
    posts: Array<typeof posts.$inferSelect>;
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

/**
 * Fetch posts dengan pagination dan search
 * Menggunakan use cache dengan cacheLife 'hours' untuk caching
 *
 * @param page - Nomor halaman (1-based)
 * @param limit - Jumlah item per halaman
 * @param search - Query pencarian (opsional)
 * @param includeUnpublished - Apakah include draft posts (untuk admin)
 */
export async function getPosts(
    page: number = 1,
    limit: number = 10,
    search?: string,
    includeUnpublished: boolean = false,
): Promise<PaginatedPosts> {
    "use cache";
    cacheLife("hours");
    cacheTag("posts", `posts-page-${page}`);

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Filter berdasarkan status publikasi (kecuali jika admin)
    if (!includeUnpublished) {
        conditions.push(eq(posts.published, "published"));
    }

    // Filter berdasarkan search query
    if (search && search.trim() !== "") {
        conditions.push(
            or(
                ilike(posts.title, `%${search}%`),
                ilike(posts.content, `%${search}%`),
            ),
        );
    }

    // Combine conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch posts dengan pagination
    const postsData = await db
        .select()
        .from(posts)
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

    // Count total untuk pagination
    const countResult = await db
        .select({ count: posts.id })
        .from(posts)
        .where(whereClause);

    const totalCount = countResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
        posts: postsData,
        totalPages,
        currentPage: page,
        totalCount,
    };
}

/**
 * Fetch single post by ID
 * Cached dengan cacheTag untuk revalidation per post
 *
 * @param id - Post ID
 */
export async function getPostById(id: string) {
    "use cache";
    cacheLife("hours");
    cacheTag(`post-${id}`, "posts");

    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] || null;
}

/**
 * Fetch single post by slug
 * Cached dengan cacheTag untuk revalidation per post
 *
 * @param slug - Post slug
 */
export async function getPostBySlug(slug: string) {
    "use cache";
    cacheLife("hours");
    cacheTag(`post-slug-${slug}`, "posts");

    const result = await db.select().from(posts).where(eq(posts.slug, slug));
    return result[0] || null;
}

/**
 * Check apakah slug sudah digunakan
 * Tidak di-cache karena perlu real-time check
 *
 * @param slug - Slug yang akan dicek
 * @param excludeId - ID post yang dikecualikan (untuk edit)
 */
export async function isSlugTaken(
    slug: string,
    excludeId?: string,
): Promise<boolean> {
    const conditions = [eq(posts.slug, slug)];

    if (excludeId) {
        conditions.push(eq(posts.id, excludeId));
    }

    const result = await db
        .select()
        .from(posts)
        .where(excludeId ? and(...conditions) : conditions[0]);

    return result.length > 0;
}
