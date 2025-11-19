"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { deletePost, togglePublishStatus } from "@/app/actions/posts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Post } from "@/drizzle/schema";
import Link from "next/link";

interface AdminPostActionsProps {
    post: Post;
}

/**
 * Komponen actions untuk admin di table/list posts
 * Menampilkan dropdown menu dengan opsi edit, toggle publish, dan delete
 */
export function AdminPostActions({ post }: AdminPostActionsProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    /**
     * Handler untuk toggle publish status
     */
    const handleTogglePublish = async () => {
        setIsToggling(true);
        try {
            const result = await togglePublishStatus(post.id);

            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.error || "Gagal mengubah status publikasi");
            }
        } catch (error) {
            console.error("Error toggling publish status:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setIsToggling(false);
        }
    };

    /**
     * Handler untuk delete post
     */
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deletePost(post.id);

            if (result.success) {
                toast.success(result.message);
                setDeleteDialogOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Gagal menghapus post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Terjadi kesalahan saat menghapus post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Edit */}
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/kegiatan/write?edit=${post.id}`}
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>

                    {/* Toggle Publish */}
                    <DropdownMenuItem
                        onClick={handleTogglePublish}
                        disabled={isToggling}
                        className="cursor-pointer"
                    >
                        {isToggling ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : post.published === "published" ? (
                            <EyeOff className="mr-2 h-4 w-4" />
                        ) : (
                            <Eye className="mr-2 h-4 w-4" />
                        )}
                        {post.published === "published"
                            ? "Unpublish"
                            : "Publish"}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Delete */}
                    <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kegiatan{" "}
                            <span className="font-semibold text-foreground">
                                &ldquo;{post.title}&rdquo;
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
