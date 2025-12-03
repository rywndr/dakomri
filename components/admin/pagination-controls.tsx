"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
}

export function PaginationControls({
    currentPage,
    totalPages,
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildUrl = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams],
    );

    const navigateToPage = useCallback(
        (page: number, e: React.MouseEvent) => {
            e.preventDefault();
            const url = buildUrl(page);
            router.push(url, { scroll: false });
        },
        [buildUrl, router],
    );

    // page number visible
    const getVisiblePages = useCallback(() => {
        const pages: number[] = [];

        // slalu tampilkan page 1
        pages.push(1);

        // tampilkan page around first page
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // slalu display last page
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages.sort((a, b) => a - b);
    }, [currentPage, totalPages]);

    // Early return after all hooks have been called
    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages();

    return (
        <div className="mt-4">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildUrl(Math.max(1, currentPage - 1))}
                            onClick={(e) =>
                                navigateToPage(Math.max(1, currentPage - 1), e)
                            }
                            aria-disabled={currentPage === 1}
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {visiblePages.map((page, index) => {
                        const showEllipsisBefore =
                            index > 0 && page - visiblePages[index - 1] > 1;

                        return (
                            <span key={page}>
                                {showEllipsisBefore && (
                                    <PaginationItem>
                                        <span className="flex h-9 w-9 items-center justify-center">
                                            ...
                                        </span>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        href={buildUrl(page)}
                                        onClick={(e) => navigateToPage(page, e)}
                                        isActive={page === currentPage}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            </span>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href={buildUrl(
                                Math.min(totalPages, currentPage + 1),
                            )}
                            onClick={(e) =>
                                navigateToPage(
                                    Math.min(totalPages, currentPage + 1),
                                    e,
                                )
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
        </div>
    );
}
