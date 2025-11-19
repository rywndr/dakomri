import { notFound } from "next/navigation";
import { getPostBySlug } from "../data";
import { MarkdownRenderer } from "@/components/kegiatan/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;

    // Fetch post berdasarkan slug
    const post = await getPostBySlug(slug);

    // Jika post tidak ditemukan, tampilkan 404
    if (!post) {
        notFound();
    }

    // Cek apakah user adalah admin
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user?.role === "admin";

    // Jika post adalah draft dan user bukan admin, tampilkan 404
    if (post.published !== "published" && !isAdmin) {
        notFound();
    }

    /**
     * Format tanggal ke format Indonesia
     */
    const formatDate = (date: Date): string => {
        try {
            return format(new Date(date), "d MMMM yyyy", { locale: localeId });
        } catch {
            return format(new Date(date), "d MMMM yyyy");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/*  Sticky nav */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Back */}
                        <Link href="/kegiatan">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Kegiatan
                            </Button>
                        </Link>

                        {/* Edit Button Admin */}
                        {isAdmin && (
                            <Link href={`/kegiatan/write?edit=${post.id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto">
                    {/* Article Header */}
                    <header className="mb-12 space-y-6">
                        {/* status if draft */}
                        {isAdmin && post.published === "draft" && (
                            <div>
                                <Badge variant="secondary" className="text-sm">
                                    Draft - Tidak Dipublikasikan
                                </Badge>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                            {post.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={post.createdAt.toISOString()}>
                                    {formatDate(post.createdAt)}
                                </time>
                            </div>

                            {post.createdAt.getTime() !==
                                post.updatedAt.getTime() && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">
                                        Diperbarui {formatDate(post.updatedAt)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Separator />
                    </header>

                    {/* Article Body - Rendered Markdown */}
                    <div className="mb-12">
                        <MarkdownRenderer content={post.content} />
                    </div>

                    {/* Article Footer */}
                    <footer className="pt-8 border-t">
                        <div className="flex items-center justify-between">
                            <Link href="/kegiatan">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Lihat Kegiatan Lainnya
                                </Button>
                            </Link>

                            {isAdmin && (
                                <Link href={`/kegiatan/write?edit=${post.id}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit Post
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
