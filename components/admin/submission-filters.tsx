"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SubmissionFiltersProps {
    currentStatus: string;
    currentSort: string;
    currentDirection: string;
}

export function SubmissionFilters({
    currentStatus,
    currentSort,
    currentDirection,
}: SubmissionFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset to first page when filter changes
        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-xs">
                    Status
                </Label>
                <Select
                    value={currentStatus}
                    onValueChange={(value) => updateFilter("status", value)}
                >
                    <SelectTrigger id="status-filter" className="w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="submitted">
                            Menunggu Verifikasi
                        </SelectItem>
                        <SelectItem value="verified">Disetujui</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="sort-filter" className="text-xs">
                    Urutkan Berdasarkan
                </Label>
                <Select
                    value={currentSort}
                    onValueChange={(value) => updateFilter("sortBy", value)}
                >
                    <SelectTrigger id="sort-filter" className="w-[180px]">
                        <SelectValue placeholder="Urutan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">
                            Tanggal Submit
                        </SelectItem>
                        <SelectItem value="namaDepan">Nama</SelectItem>
                        <SelectItem value="kota">Kota</SelectItem>
                        <SelectItem value="verifiedAt">
                            Tanggal Verifikasi
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="direction-filter" className="text-xs">
                    Arah
                </Label>
                <Select
                    value={currentDirection}
                    onValueChange={(value) =>
                        updateFilter("sortDirection", value)
                    }
                >
                    <SelectTrigger id="direction-filter" className="w-[140px]">
                        <SelectValue placeholder="Arah" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Terbaru</SelectItem>
                        <SelectItem value="asc">Terlama</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
