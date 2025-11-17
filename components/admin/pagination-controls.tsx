"use client";

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
    baseUrl?: string;
    searchQuery?: string;
    searchParam?: string;
}

export function PaginationControls({
    currentPage,
    totalPages,
    baseUrl = "",
    searchQuery = "",
    searchParam = "search",
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    const buildUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());

        if (searchQuery) {
            params.set(searchParam, searchQuery);
        }

        return `${baseUrl}?${params.toString()}`;
    };

    // page number visible
    const getVisiblePages = () => {
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
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="mt-4">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildUrl(Math.max(1, currentPage - 1))}
                            aria-disabled={currentPage === 1}
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
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
                                        isActive={page === currentPage}
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
                            aria-disabled={currentPage === totalPages}
                            className={
                                currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
