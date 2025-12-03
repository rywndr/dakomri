import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPosts } from "@/app/(main)/(public)/kegiatan/data";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { PostsSearch } from "@/components/kegiatan/posts-search";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { AdminPostActions } from "@/components/kegiatan/admin-post-actions";
import type { Metadata } from "next";

/**
 * Interface untuk searchParams
 */
interface SearchParams {
    page?: string;
    search?: string;
}

interface AdminKegiatanPageProps {
    searchParams: Promise<SearchParams>;
}

/**
 * Komponen loading untuk table
 */
function TableLoading() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
}

/**
 * Komponen server untuk fetch dan render posts table
 */
async function PostsTable({ searchParams }: { searchParams: SearchParams }) {
    // Parse query params
    const page = parseInt(searchParams.page || "1");
    const search = searchParams.search || "";
    const limit = 20; // 20 posts per halaman untuk admin

    // Fetch posts (include draft posts untuk admin)
    const { posts, totalPages, currentPage } = await getPosts(
        page,
        limit,
        search,
        true, // Include unpublished
    );

    /**
     * Format tanggal ke format Indonesia
     */
    const formatDate = (date: Date): string => {
        try {
            return format(new Date(date), "d MMM yyyy", { locale: localeId });
        } catch {
            return format(new Date(date), "d MMM yyyy");
        }
    };

    return (
        <div className="space-y-6">
            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Judul</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[15%]">Dibuat</TableHead>
                            <TableHead className="w-[15%]">
                                Diperbarui
                            </TableHead>
                            <TableHead className="w-[15%] text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Link
                                                href={`/kegiatan/${post.slug}`}
                                                className="font-medium hover:text-primary transition-colors line-clamp-2"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                /{post.slug}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                post.published === "published"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {post.published === "published" ? (
                                                <>
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="mr-1 h-3 w-3" />
                                                    Draft
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(post.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(post.updatedAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AdminPostActions post={post} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    <div className="text-muted-foreground">
                                        {search
                                            ? "Tidak ada kegiatan yang ditemukan"
                                            : "Belum ada kegiatan"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination - uses client component with router.push for smooth navigation */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}

function PageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
            <TableLoading />
        </div>
    );
}

/**
 * Server component untuk authenticated admin kegiatan content
 * Wrapped in Suspense karena menggunakan headers()
 * searchParams diakses di dalam komponen ini agar berada dalam Suspense boundary
 */
async function AuthenticatedAdminKegiatanContent({
    searchParamsPromise,
}: {
    searchParamsPromise: Promise<SearchParams>;
}) {
    // Await searchParams di dalam Suspense boundary
    const searchParams = await searchParamsPromise;

    // Cek autentikasi dan role - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/auth/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Kelola Kegiatan</h1>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan hapus kegiatan untuk komunitas
                    </p>
                </div>
                <Link href="/kegiatan/write">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kegiatan
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <PostsSearch
                    placeholder="Cari kegiatan..."
                    className="w-full"
                />
            </div>

            {/* Table dengan Suspense */}
            <Suspense
                key={JSON.stringify(searchParams)}
                fallback={<TableLoading />}
            >
                <PostsTable searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

/**
 * Halaman Admin untuk manajemen kegiatan/posts
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 * searchParams diakses di dalam Suspense untuk menghindari blocking route
 */
export default function AdminKegiatanPage({
    searchParams,
}: AdminKegiatanPageProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <AuthenticatedAdminKegiatanContent
                searchParamsPromise={searchParams}
            />
        </Suspense>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Kelola Kegiatan | Admin DAKOMRI",
    description: "Halaman admin untuk mengelola kegiatan",
};
