"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { Post } from "@/drizzle/schema";
import Link from "next/link";

interface PostCardProps {
    post: Post;
    showStatus?: boolean;
}

export function PostCard({ post, showStatus = false }: PostCardProps) {
    const getExcerpt = (content: string, maxLength: number = 150): string => {
        // Hilangkan markdown formatting
        let text = content
            .replace(/[#*`_\[\]()]/g, "") // Hapus karakter markdown
            .replace(/\n/g, " ") // Replace newlines dengan space
            .trim();

        // Truncate jika lebih panjang dari maxLength
        if (text.length > maxLength) {
            text = text.substring(0, maxLength).trim() + "...";
        }

        return text;
    };

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
        <Link href={`/kegiatan/${post.slug}`} className="block h-full">
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                            <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                                {post.title}
                            </CardTitle>
                        </div>
                        {showStatus && (
                            <Badge
                                variant={
                                    post.published === "published"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {post.published === "published"
                                    ? "Published"
                                    : "Draft"}
                            </Badge>
                        )}
                    </div>

                    <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.createdAt.toISOString()}>
                            {formatDate(post.createdAt)}
                        </time>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {getExcerpt(post.content)}
                    </p>
                </CardContent>

                <CardFooter className="pt-4 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                    >
                        Baca Selengkapnya
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
