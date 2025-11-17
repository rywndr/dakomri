"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface KomunitasExportButtonProps {
    totalMembers: number;
}

export function KomunitasExportButton({
    totalMembers,
}: KomunitasExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: "pdf" | "excel") => {
        if (totalMembers === 0) {
            toast.error("Tidak ada data untuk diekspor");
            return;
        }

        setIsExporting(true);

        try {
            const response = await fetch(
                `/api/admin/komunitas/export?format=${format}`,
                {
                    method: "GET",
                },
            );

            if (!response.ok) {
                throw new Error("Export gagal");
            }

            // Get filename
            const contentDisposition = response.headers.get(
                "content-disposition",
            );
            let filename = `komunitas-export.${format === "pdf" ? "pdf" : "xlsx"}`;

            if (contentDisposition) {
                const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
                if (matches && matches[1]) {
                    filename = matches[1];
                }
            }

            // Download file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(
                `Data berhasil diekspor sebagai ${format.toUpperCase()}`,
                {
                    description: `File ${filename} telah diunduh`,
                },
            );
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal mengekspor data", {
                description: "Silakan coba lagi nanti",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    disabled={isExporting || totalMembers === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Mengekspor..." : "Ekspor Data"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => handleExport("excel")}
                    disabled={isExporting}
                >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Ekspor sebagai Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleExport("pdf")}
                    disabled={isExporting}
                >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Ekspor sebagai PDF</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
