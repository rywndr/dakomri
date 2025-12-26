"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn("flex flex-row items-center gap-1", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
    React.ComponentProps<"a">;

function PaginationLink({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size,
                }),
                className,
            )}
            {...props}
        />
    );
}

function PaginationPrevious({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
            {...props}
        >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn("flex size-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

// --- Logic Part ---

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
}

function PaginationControls({
    currentPage,
    totalPages,
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper bikin URL pagination
    const buildUrl = React.useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams],
    );

    // Handle navigasi client-side biar gak full reload
    const handleNavigation = React.useCallback(
        (page: number, e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            // Cegah navigasi if page gak valid or lagi aktif
            if (page === currentPage || page < 1 || page > totalPages) return;

            const url = buildUrl(page);
            router.push(url, { scroll: false });
        },
        [buildUrl, currentPage, router, totalPages],
    );

    // Logic buat nentuin item pagination (nomor & ...)
    const paginationItems = React.useMemo(() => {
        const items: (number | "ellipsis")[] = [];
        const pages = new Set<number>();

        // Selalu tampilin halaman pertama & terakhir
        pages.add(1);
        pages.add(totalPages);

        // Tampilin halaman di sekitar halaman aktif (current - 1, current, current + 1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.add(i);
            }
        }

        // Sort
        const sortedPages = Array.from(pages).sort((a, b) => a - b);

        // Masukin ellipsis kalo ada gap antar halaman
        for (let i = 0; i < sortedPages.length; i++) {
            const page = sortedPages[i];
            if (i > 0) {
                const prevPage = sortedPages[i - 1];
                // Kalo selisih lebih dari 1, berarti ada gap == ellipsis
                if (page - prevPage > 1) {
                    items.push("ellipsis");
                }
            }
            items.push(page);
        }

        return items;
    }, [currentPage, totalPages]);

    // no render if 1 halaman
    if (totalPages <= 1) return null;

    return (
        <div className="mt-4">
            <Pagination>
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildUrl(currentPage - 1)}
                            onClick={(e) =>
                                handleNavigation(currentPage - 1, e)
                            }
                            aria-disabled={currentPage <= 1}
                            className={
                                currentPage <= 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {/* Render nomor halaman & ... */}
                    {paginationItems.map((item, index) => (
                        <PaginationItem key={`${item}-${index}`}>
                            {item === "ellipsis" ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={buildUrl(item)}
                                    onClick={(e) => handleNavigation(item, e)}
                                    isActive={currentPage === item}
                                    className="cursor-pointer"
                                >
                                    {item}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                        <PaginationNext
                            href={buildUrl(currentPage + 1)}
                            onClick={(e) =>
                                handleNavigation(currentPage + 1, e)
                            }
                            aria-disabled={currentPage >= totalPages}
                            className={
                                currentPage >= totalPages
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

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationControls,
};
