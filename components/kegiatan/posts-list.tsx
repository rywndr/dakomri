"use client";

import { PostCard } from "./post-card";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Post } from "@/drizzle/schema";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PostsListProps {
    posts: Post[];
    totalPages: number;
    currentPage: number;
    isAdmin?: boolean;
}

export function PostsList({
    posts,
    totalPages,
    currentPage,
    isAdmin = false,
}: PostsListProps) {
    const router = useRouter();

    /**
     * Handler untuk navigasi pagination
     */
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    /**
     * Generate array halaman untuk pagination
     * Menampilkan current page, surrounding pages, dan titiek titiek (...)
     */
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const delta = 2; // Jumlah halaman di kiri dan kanan current page

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // Halaman pertama
                i === totalPages || // Halaman terakhir
                (i >= currentPage - delta && i <= currentPage + delta) // Surrounding pages
            ) {
                pages.push(i);
            } else if (
                pages[pages.length - 1] !== "ellipsis" // Hindari double titik titik
            ) {
                pages.push("ellipsis");
            }
        }

        return pages;
    };

    return (
        <div className="space-y-8">
            {/* Posts Grid */}
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            showStatus={isAdmin}
                        />
                    ))}
                </div>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>Tidak ada kegiatan</EmptyTitle>
                        <EmptyDescription>
                            {isAdmin
                                ? "Belum ada kegiatan yang ditambahkan. Klik tombol + di pojok kanan bawah untuk menambahkan kegiatan baru."
                                : "Belum ada kegiatan yang dipublikasikan."}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {/* Previous Button */}
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() =>
                                    currentPage > 1 &&
                                    handlePageChange(currentPage - 1)
                                }
                                aria-disabled={currentPage === 1}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "ellipsis" ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => handlePageChange(page)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        {/* Next Button */}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    currentPage < totalPages &&
                                    handlePageChange(currentPage + 1)
                                }
                                aria-disabled={currentPage === totalPages}
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {/* Floating Action Button - hanya untuk admin */}
            {isAdmin && (
                <Link href="/kegiatan/write">
                    <Button
                        size="lg"
                        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
                        aria-label="Tulis kegiatan baru"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </Link>
            )}
        </div>
    );
}
