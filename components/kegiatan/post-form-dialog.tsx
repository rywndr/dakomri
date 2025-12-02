"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MarkdownEditor } from "./markdown-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Post } from "@/drizzle/schema";

/**
 * Interface untuk data form post
 */
export interface PostInput {
    title: string;
    content: string;
    published: "draft" | "published";
}

interface PostFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post?: Post | null;
    onSuccess?: () => void;
}

/**
 * Dialog form untuk membuat atau mengedit post
 * Menggunakan API routes untuk mutasi data
 */
export function PostFormDialog({
    open,
    onOpenChange,
    post,
    onSuccess,
}: PostFormDialogProps) {
    const isEdit = !!post;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<PostInput>({
        title: "",
        content: "",
        published: "draft",
    });

    // Reset form ketika dialog dibuka/ditutup atau post berubah
    useEffect(() => {
        if (open) {
            if (post) {
                setFormData({
                    title: post.title,
                    content: post.content,
                    published: post.published as "draft" | "published",
                });
            } else {
                setFormData({
                    title: "",
                    content: "",
                    published: "draft",
                });
            }
        }
    }, [open, post]);

    /**
     * Handler untuk submit form via API
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi
        if (!formData.title.trim()) {
            toast.error("Judul tidak boleh kosong");
            return;
        }

        if (!formData.content.trim()) {
            toast.error("Konten tidak boleh kosong");
            return;
        }

        setIsSubmitting(true);

        try {
            let response;

            if (isEdit && post) {
                // Update post yang sudah ada via API
                response = await fetch(`/api/posts/${post.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // Create post baru via API
                response = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            }

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message);
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(result.error || "Terjadi kesalahan");
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            toast.error("Terjadi kesalahan saat menyimpan post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Ubah informasi kegiatan yang sudah ada"
                            : "Buat kegiatan baru dengan dukungan format markdown"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Judul */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Judul <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Contoh: Workshop Kesetaraan Gender"
                            required
                        />
                    </div>

                    {/* Konten Markdown */}
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            Konten <span className="text-destructive">*</span>
                        </Label>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={(value) =>
                                setFormData({ ...formData, content: value })
                            }
                            placeholder="Tulis konten kegiatan dengan format markdown..."
                        />
                    </div>

                    {/* Status Publikasi */}
                    <div className="space-y-2">
                        <Label>Status Publikasi</Label>
                        <RadioGroup
                            value={formData.published}
                            onValueChange={(value: "draft" | "published") =>
                                setFormData({ ...formData, published: value })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="draft" id="draft" />
                                <Label
                                    htmlFor="draft"
                                    className="font-normal cursor-pointer"
                                >
                                    Draft (tidak tampil di publik)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="published"
                                    id="published"
                                />
                                <Label
                                    htmlFor="published"
                                    className="font-normal cursor-pointer"
                                >
                                    Published (tampil di publik)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? "Simpan Perubahan" : "Buat Kegiatan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
