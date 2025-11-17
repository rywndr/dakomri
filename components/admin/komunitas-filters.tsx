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

interface KomunitasFiltersProps {
    currentEmployment: string;
    currentDiscrimination: string;
    currentSocialAssistance: string;
}

export function KomunitasFilters({
    currentEmployment,
    currentDiscrimination,
    currentSocialAssistance,
}: KomunitasFiltersProps) {
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

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
                <Label htmlFor="employment-filter" className="text-xs">
                    Status Pekerjaan
                </Label>
                <Select
                    value={currentEmployment}
                    onValueChange={(value) => updateFilter("employment", value)}
                >
                    <SelectTrigger id="employment-filter" className="w-[180px]">
                        <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="Bekerja">Bekerja</SelectItem>
                        <SelectItem value="Tidak Bekerja">
                            Tidak Bekerja
                        </SelectItem>
                        <SelectItem value="Pelajar Mahasiswa">
                            Pelajar/Mahasiswa
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="discrimination-filter" className="text-xs">
                    Pernah Diskriminasi
                </Label>
                <Select
                    value={currentDiscrimination}
                    onValueChange={(value) =>
                        updateFilter("discrimination", value)
                    }
                >
                    <SelectTrigger
                        id="discrimination-filter"
                        className="w-[180px]"
                    >
                        <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="Pernah mengalami">
                            Pernah Mengalami
                        </SelectItem>
                        <SelectItem value="Tidak pernah">
                            Tidak Pernah
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="social-assistance-filter" className="text-xs">
                    Bantuan Sosial
                </Label>
                <Select
                    value={currentSocialAssistance}
                    onValueChange={(value) =>
                        updateFilter("socialAssistance", value)
                    }
                >
                    <SelectTrigger
                        id="social-assistance-filter"
                        className="w-[180px]"
                    >
                        <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="yes">Menerima</SelectItem>
                        <SelectItem value="no">Tidak Menerima</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
