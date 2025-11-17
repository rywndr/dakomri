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

interface UserFiltersProps {
    currentRole: string;
    currentStatus: string;
}

export function UserFilters({ currentRole, currentStatus }: UserFiltersProps) {
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
                <Label htmlFor="role-filter" className="text-xs">
                    Role
                </Label>
                <Select
                    value={currentRole}
                    onValueChange={(value) => updateFilter("role", value)}
                >
                    <SelectTrigger id="role-filter" className="w-[180px]">
                        <SelectValue placeholder="Semua Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Role</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="banned">Diblokir</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
