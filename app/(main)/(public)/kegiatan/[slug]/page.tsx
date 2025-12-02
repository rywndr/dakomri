import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "../data";
import { MarkdownRenderer } from "@/components/kegiatan/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

function PostPageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto">
                    <header className="mb-12 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-4 w-48" />
                        <Separator />
                    </header>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </article>
            </main>
        </div>
    );
}

function formatDate(date: Date): string {
    try {
        return format(new Date(date), "d MMMM yyyy", { locale: localeId });
    } catch {
        return format(new Date(date), "d MMMM yyyy");
    }
}

/**
 * Server component untuk admin controls
 */
async function AdminControls({ postId }: { postId: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    return (
        <Link href={`/kegiatan/write?edit=${postId}`}>
            <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
            </Button>
        </Link>
    );
}

/**
 * Server component untuk draft badge
 */
async function DraftBadge({ published }: { published: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin || published !== "draft") return null;

    return (
        <div>
            <Badge variant="secondary" className="text-sm">
                Draft - Tidak Dipublikasikan
            </Badge>
        </div>
    );
}

/**
 * Server component untuk footer admin controls
 */
async function FooterAdminControls({ postId }: { postId: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user?.role === "admin";

    if (!isAdmin) return null;

    return (
        <Link href={`/kegiatan/write?edit=${postId}`}>
            <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Post
            </Button>
        </Link>
    );
}

/**
 * Server component untuk seluruh page content
 * Semua uncached data access (headers, auth, params, dll) dilakukan di dalam komponen ini
 * yang di-wrap dengan Suspense di parent
 */
async function PostPageContent({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // Await params inside Suspense boundary
    const { slug } = await params;
    // Fetch post berdasarkan slug - ini cached dengan use cache
    const post = await getPostBySlug(slug);

    // Jika post tidak ditemukan, tampilkan 404
    if (!post) {
        notFound();
    }

    // Access check untuk draft posts - menggunakan headers() yang memerlukan Suspense
    if (post.published !== "published") {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const isAdmin = session?.user?.role === "admin";

        if (!isAdmin) {
            notFound();
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky nav */}
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

                        <Suspense fallback={<Skeleton className="h-9 w-20" />}>
                            <AdminControls postId={post.id} />
                        </Suspense>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto">
                    {/* Article Header */}
                    <header className="mb-12 space-y-6">
                        <Suspense fallback={null}>
                            <DraftBadge published={post.published} />
                        </Suspense>

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

                            {/* Footer admin controls - wrapped in Suspense */}
                            <Suspense fallback={null}>
                                <FooterAdminControls postId={post.id} />
                            </Suspense>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}

/**
 * Halaman detail Kegiatan/Post
 * Menggunakan Suspense boundary untuk SEMUA dynamic content termasuk params access
 */
export default function PostPage({ params }: PostPageProps) {
    return (
        <Suspense fallback={<PostPageSkeleton />}>
            <PostPageContent params={params} />
        </Suspense>
    );
}
