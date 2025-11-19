"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MarkdownEditor } from "@/components/kegiatan/markdown-editor";
import {
    createPost,
    updatePost,
    getPostByIdAction,
    PostInput,
} from "@/app/actions/posts";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function WritePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEdit = !!editId;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<PostInput>({
        title: "",
        content: "",
        published: "draft",
    });

    /**
     * Load post data jika dalam mode edit
     */
    useEffect(() => {
        if (editId) {
            setIsLoading(true);
            getPostByIdAction(editId)
                .then((result) => {
                    if (result.success && result.post) {
                        setFormData({
                            title: result.post.title,
                            content: result.post.content,
                            published: result.post.published as
                                | "draft"
                                | "published",
                        });
                    } else {
                        toast.error(result.error || "Post tidak ditemukan");
                        router.push("/kegiatan");
                    }
                })
                .catch((error) => {
                    console.error("Error loading post:", error);
                    toast.error("Gagal memuat post");
                    router.push("/kegiatan");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [editId, router]);

    /**
     * Handler untuk save post
     */
    const handleSave = async (publish: boolean = false) => {
        // Validasi
        if (!formData.title.trim()) {
            toast.error("Judul tidak boleh kosong");
            return;
        }

        if (!formData.content.trim()) {
            toast.error("Konten tidak boleh kosong");
            return;
        }

        setIsSaving(true);

        try {
            const dataToSave: PostInput = {
                ...formData,
                published: publish ? "published" : formData.published,
            };

            let result;

            if (isEdit && editId) {
                // Update post yang sudah ada
                result = await updatePost(editId, dataToSave);
            } else {
                // Create post baru
                result = await createPost(dataToSave);
            }

            if (result.success) {
                toast.success(result.message);
                router.push("/kegiatan");
                router.refresh();
            } else {
                toast.error(result.error || "Terjadi kesalahan");
            }
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Terjadi kesalahan saat menyimpan post");
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handler untuk publish langsung
     */
    const handlePublish = () => {
        handleSave(true);
    };

    /**
     * Handler untuk save as draft
     */
    const handleSaveDraft = () => {
        handleSave(false);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button */}
                        <Link href="/kegiatan">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                            >
                                {isSaving && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Draft
                            </Button>
                            <Button
                                size="sm"
                                onClick={handlePublish}
                                disabled={isSaving}
                            >
                                {isSaving && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                <Eye className="mr-2 h-4 w-4" />
                                Publikasikan
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Title Section */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base">
                                Judul Kegiatan
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
                                placeholder="Tulis judul yang menarik..."
                                className="text-3xl font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <Separator />

                        {/* Status Publikasi */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Status Publikasi
                            </Label>
                            <RadioGroup
                                value={formData.published}
                                onValueChange={(value: "draft" | "published") =>
                                    setFormData({
                                        ...formData,
                                        published: value,
                                    })
                                }
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="draft" id="draft" />
                                    <Label
                                        htmlFor="draft"
                                        className="font-normal cursor-pointer text-sm"
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
                                        className="font-normal cursor-pointer text-sm"
                                    >
                                        Published (tampil di publik)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Separator />

                    {/* Markdown Editor */}
                    <div className="space-y-2">
                        <Label className="text-base">Konten</Label>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={(value) =>
                                setFormData({ ...formData, content: value })
                            }
                            placeholder="Mulai menulis konten dengan format markdown..."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
