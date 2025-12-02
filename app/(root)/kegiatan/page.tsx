import { Metadata } from "next";
import { Suspense } from "react";
import { PostsList } from "@/components/kegiatan/posts-list";
import { PostsSearch } from "@/components/kegiatan/posts-search";
import { getPosts } from "./data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Interface untuk searchParams
 */
interface SearchParams {
    page?: string;
    search?: string;
}

interface KegiatanPageProps {
    searchParams: Promise<SearchParams>;
}

/**
 * Skeleton loading untuk Posts Grid
 */
function PostsGridSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[250px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Skeleton loading untuk Search Bar
 */
function SearchSkeleton() {
    return <Skeleton className="h-10 w-full rounded-md" />;
}

/**
 * Server component untuk konten posts dengan caching
 * Data di-fetch dari cached getPosts function
 * searchParams diakses di dalam komponen ini agar berada dalam Suspense boundary
 */
async function PostsContent({
    searchParamsPromise,
}: {
    searchParamsPromise: Promise<SearchParams>;
}) {
    // Await searchParams di dalam Suspense boundary
    const searchParams = await searchParamsPromise;

    // Parse query params
    const page = parseInt(searchParams.page || "1");
    const search = searchParams.search || "";
    const limit = 9; // 9 posts per halaman (3x3 grid)

    // Cek apakah user adalah admin
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user?.role === "admin";

    // Fetch posts - menggunakan cached function
    const { posts, totalPages, currentPage } = await getPosts(
        page,
        limit,
        search,
        isAdmin, // Include draft posts jika admin
    );

    return (
        <PostsList
            posts={posts}
            totalPages={totalPages}
            currentPage={currentPage}
            isAdmin={isAdmin}
        />
    );
}

/**
 * Halaman Kegiatan dengan Suspense boundaries
 * Menggunakan cached data dari data.ts
 * searchParams Promise di-pass ke child component untuk diakses dalam Suspense
 */
export default function KegiatanPage({ searchParams }: KegiatanPageProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 space-y-10">
                {/* Header - static content */}
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Kegiatan
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Informasi tentang kegiatan dan program untuk komunitas
                        waria di Tanjungpinang
                    </p>
                </div>

                {/* Search Bar - client component */}
                <div className="max-w-2xl mx-auto">
                    <Suspense fallback={<SearchSkeleton />}>
                        <PostsSearch
                            placeholder="Cari kegiatan berdasarkan judul atau konten..."
                            className="w-full"
                        />
                    </Suspense>
                </div>

                {/* Posts List dengan Suspense untuk loading state */}
                {/* searchParams Promise di-pass langsung tanpa await di level page */}
                <Suspense fallback={<PostsGridSkeleton />}>
                    <PostsContent searchParamsPromise={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Kegiatan | DAKOMRI Tanjungpinang",
    description:
        "Informasi kegiatan dan program untuk komunitas waria di Tanjungpinang",
};
