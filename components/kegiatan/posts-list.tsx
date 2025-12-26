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
import type { Post } from "@/drizzle/schema";
import Link from "next/link";
import { PaginationControls } from "@/components/ui/pagination";

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
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
            />

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
