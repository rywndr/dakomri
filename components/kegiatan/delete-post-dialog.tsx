"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Post } from "@/drizzle/schema";

interface DeletePostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: Post | null;
    onSuccess?: () => void;
}

/**
 * Dialog konfirmasi untuk menghapus post
 * Menggunakan API route untuk delete
 */
export function DeletePostDialog({
    open,
    onOpenChange,
    post,
    onSuccess,
}: DeletePostDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * Handler untuk konfirmasi delete via API
     */
    const handleDelete = async () => {
        if (!post) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message);
                onOpenChange(false);
                onSuccess?.();
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kegiatan{" "}
                        <span className="font-semibold text-foreground">
                            &ldquo;{post?.title}&rdquo;
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
    );
}
