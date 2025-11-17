"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSearchProps {
    placeholder?: string;
    /**
     * Debounce delay in ms
     * @default 300
     */
    debounceMs?: number;
    /**
     * URL search param key
     * @default "search"
     */
    searchParam?: string;
    /**
     * Additional CSS classes
     */
    className?: string;
}

export function AdminSearch({
    placeholder = "Cari...",
    debounceMs = 300,
    searchParam = "search",
    className = "",
}: AdminSearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial value from URL
    const initialSearch = searchParams.get(searchParam) || "";

    // Local state for controlled input
    const [searchValue, setSearchValue] = useState(initialSearch);

    // Debounced value
    const [debouncedSearchValue] = useDebounce(searchValue, debounceMs);

    // Sync URL with debounced value
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearchValue) {
            params.set(searchParam, debouncedSearchValue);
            // Reset to page 1 when searching
            params.set("page", "1");
        } else {
            params.delete(searchParam);
        }

        // Use replace to avoid cluttering browser history
        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchValue, pathname, searchParam]);

    // Clear search handler
    const handleClear = () => {
        setSearchValue("");
    };

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 pr-9"
            />
            {searchValue && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={handleClear}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                </Button>
            )}
        </div>
    );
}
