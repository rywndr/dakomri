import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePosts } from "@/lib/revalidate";

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

/**
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
    try {
        const { error, user } = await validateAdmin();
        if (error || !user) {
            return NextResponse.json(
                { error: error || "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { title, content, published } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 },
            );
        }

        // Generate slug dari title
        let slug = generateSlug(title);
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
        const [newPost] = await db
            .insert(posts)
            .values({
                id: nanoid(),
                title,
                content,
                slug,
                published: published || "draft",
                createdBy: user.id,
                updatedBy: user.id,
            })
            .returning();

        // Revalidate posts cache
        await revalidatePosts();
        revalidatePath("/kegiatan");
        revalidatePath("/admin/kegiatan");

        return NextResponse.json(
            {
                success: true,
                post: newPost,
                message: "Post berhasil dibuat",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * GET /api/posts
 * Get a post by ID (query param)
 */
export async function GET(request: NextRequest) {
    try {
        const { error, user } = await validateAdmin();
        if (error || !user) {
            return NextResponse.json(
                { error: error || "Unauthorized" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 },
            );
        }

        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, id))
            .limit(1);

        if (!post) {
            return NextResponse.json(
                { error: "Post tidak ditemukan" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                post,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
