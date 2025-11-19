"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
    FileSpreadsheet,
    Download,
    Upload,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowLeft,
} from "lucide-react";

interface BulkUploadProps {
    onBack: () => void;
}

interface UploadResult {
    success: boolean;
    successCount?: number;
    errorCount?: number;
    errors?: Array<{ row: number; message: string }>;
}

export function BulkUpload({ onBack }: BulkUploadProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
                "text/csv",
            ];

            if (!validTypes.includes(selectedFile.type)) {
                toast.error("Format file tidak valid", {
                    description:
                        "Harap unggah file Excel (.xlsx, .xls) atau CSV (.csv)",
                });
                return;
            }

            setFile(selectedFile);
            setUploadResult(null);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await fetch("/api/admin/submissions/template");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "template_pengajuan.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Template berhasil diunduh");
        } catch (error) {
            toast.error("Gagal mengunduh template", {
                description: "Silakan coba lagi",
            });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Pilih file terlebih dahulu");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/admin/submissions/bulk-upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error("Gagal mengunggah file", {
                    description: data.error || "Silakan coba lagi",
                });
                return;
            }

            setUploadResult(data);

            if (data.success) {
                toast.success("Upload berhasil!", {
                    description: `${data.successCount} pengajuan berhasil ditambahkan`,
                });

                // Redirect stelah upload
                setTimeout(() => {
                    router.push("/admin/komunitas");
                }, 2000);
            } else {
                toast.warning("Upload selesai dengan error", {
                    description: `${data.successCount} berhasil, ${data.errorCount} gagal`,
                });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan", {
                description: "Gagal mengunggah file. Silakan coba lagi.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mb-2 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Upload Massal Pengajuan
                    </h1>
                    <p className="text-muted-foreground">
                        Unggah file Excel atau CSV untuk menambahkan banyak
                        pengajuan sekaligus
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Instruksi */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Panduan Upload
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">
                                    Langkah-langkah:
                                </h3>
                                <ol className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <span className="font-semibold">
                                            1.
                                        </span>
                                        <span>Unduh template Excel</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold">
                                            2.
                                        </span>
                                        <span>
                                            Isi data sesuai kolom yang tersedia
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold">
                                            3.
                                        </span>
                                        <span>Simpan file (format .xlsx)</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold">
                                            4.
                                        </span>
                                        <span>
                                            Unggah file yang sudah diisi
                                        </span>
                                    </li>
                                </ol>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleDownloadTemplate}
                            >
                                <Download className="h-4 w-4" />
                                Unduh Template
                            </Button>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Penting!</AlertTitle>
                                <AlertDescription className="text-xs">
                                    Jangan ubah nama kolom atau urutan kolom
                                    pada template. Pastikan semua field wajib
                                    (yang ditandai *) terisi dengan benar.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                            <CardDescription>
                                Pilih file Excel atau CSV yang berisi data
                                pengajuan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Pilih File</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || isUploading}
                                        className="gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Spinner className="h-4 w-4" />
                                                Mengunggah...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                Upload
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {file && (
                                    <p className="text-sm text-muted-foreground">
                                        File terpilih: {file.name} (
                                        {(file.size / 1024).toFixed(2)} KB)
                                    </p>
                                )}
                            </div>

                            <Alert>
                                <FileSpreadsheet className="h-4 w-4" />
                                <AlertTitle>Format yang Diterima</AlertTitle>
                                <AlertDescription>
                                    File Excel (.xlsx, .xls) atau CSV (.csv)
                                    dengan maksimal ukuran 10 MB
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Hasil Upload */}
                    {uploadResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {uploadResult.success ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            Upload Berhasil
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-orange-600" />
                                            Upload Selesai dengan Error
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                                        <div className="text-2xl font-bold text-green-600">
                                            {uploadResult.successCount || 0}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Data Berhasil
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950">
                                        <div className="text-2xl font-bold text-red-600">
                                            {uploadResult.errorCount || 0}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Data Gagal
                                        </div>
                                    </div>
                                </div>

                                {uploadResult.errors &&
                                    uploadResult.errors.length > 0 && (
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-sm">
                                                Detail Error:
                                            </h3>
                                            <div className="max-h-60 space-y-2 overflow-y-auto">
                                                {uploadResult.errors.map(
                                                    (error, index) => (
                                                        <Alert
                                                            key={index}
                                                            variant="destructive"
                                                        >
                                                            <AlertDescription className="text-xs">
                                                                Baris{" "}
                                                                {error.row}:{" "}
                                                                {error.message}
                                                            </AlertDescription>
                                                        </Alert>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {uploadResult.success && (
                                    <Button
                                        onClick={() =>
                                            router.push("/admin/komunitas")
                                        }
                                        className="w-full"
                                    >
                                        Lihat Data Komunitas
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
