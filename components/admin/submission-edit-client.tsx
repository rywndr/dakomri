"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { FormSubmission } from "@/drizzle/schema";
import type {
    FormData,
    CommunityFormApi,
    JenisKelamin,
    StatusKepemilikanEKTP,
    StatusKependudukan,
    StatusTempatTinggal,
    StatusPerkawinan,
    PendidikanTerakhir,
    StatusPekerjaan,
    AksesLayananKesehatan,
    PernahDiskriminasi,
    JenisDiskriminasi,
} from "@/types/form";

import { Section1 } from "@/components/form/section-1";
import { Section2 } from "@/components/form/section-2";
import { Section3, Section4, Section5 } from "@/components/form/sections-3-5";
import {
    Section6,
    Section7,
    Section8,
    Section9,
    Section10,
    Section11,
} from "@/components/form/sections-6-11";

interface SubmissionEditClientProps {
    initialData: Partial<FormSubmission> & {
        id: string;
        jenisPelatihanDiikuti?: string[];
        penyelenggaraPelatihan?: string[];
        pelatihanDiinginkan?: string[];
        jenisDisabilitas?: string[];
        jenisDiskriminasi?: string[];
        pelakuDiskriminasi?: string[];
        lokasiKejadian?: string[];
        bantuanSosialLainnya?: string[];
        pendapatanBulanan?: number;
    };
}

export function SubmissionEditClient({
    initialData,
}: SubmissionEditClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const fullName = [initialData.namaDepan, initialData.namaBelakang]
        .filter(Boolean)
        .join(" ");

    // Helper to convert null to undefined
    const toUndefined = <T,>(value: T | null | undefined): T | undefined =>
        value === null ? undefined : value;

    // Helper to convert ISO string to Date object (for serialized dates from server)
    const toDate = (
        value: string | Date | null | undefined,
    ): Date | undefined => {
        if (!value) return undefined;
        if (value instanceof Date) return value;
        // Handle ISO string from server serialization
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    };

    const defaultValues: FormData = {
        // Section 1: Data Pribadi
        namaDepan: initialData.namaDepan || "",
        namaBelakang: toUndefined(initialData.namaBelakang),
        namaAlias: toUndefined(initialData.namaAlias),
        tempatLahir: toUndefined(initialData.tempatLahir),
        // Convert ISO string back to Date object (server serializes Date to string)
        tanggalLahir: toDate(
            initialData.tanggalLahir as string | Date | null | undefined,
        ),
        usia: toUndefined(initialData.usia),
        jenisKelamin: toUndefined(initialData.jenisKelamin) as
            | JenisKelamin
            | undefined,
        identitasGender: toUndefined(initialData.identitasGender),

        // Section 2: Dokumen Kependudukan
        nik: initialData.nik || "",
        nomorKK: initialData.nomorKK || "",
        statusKepemilikanEKTP: (initialData.statusKepemilikanEKTP ||
            "Memiliki") as StatusKepemilikanEKTP,

        // Section 3: Alamat
        alamatLengkap: initialData.alamatLengkap || "",
        kelurahan: toUndefined(initialData.kelurahan),
        kecamatan: toUndefined(initialData.kecamatan),
        kabupaten: toUndefined(initialData.kabupaten),
        kota: initialData.kota || "",
        statusKependudukan: toUndefined(initialData.statusKependudukan) as
            | StatusKependudukan
            | undefined,
        statusTempatTinggal: toUndefined(initialData.statusTempatTinggal) as
            | StatusTempatTinggal
            | undefined,

        // Section 4: Kontak
        kontakTelp: initialData.kontakTelp || "",

        // Section 5: Pekerjaan & Ekonomi
        statusPerkawinan: initialData.statusPerkawinan as
            | StatusPerkawinan
            | undefined,
        pendidikanTerakhir: initialData.pendidikanTerakhir as
            | PendidikanTerakhir
            | undefined,
        statusPekerjaan: toUndefined(initialData.statusPekerjaan) as
            | StatusPekerjaan
            | undefined,
        jenisPekerjaan: toUndefined(initialData.jenisPekerjaan),
        pendapatanBulanan: toUndefined(initialData.pendapatanBulanan),
        memilikiUsaha: toUndefined(initialData.memilikiUsaha),
        detailUsaha: toUndefined(initialData.detailUsaha),

        // Section 6: Pelatihan
        pernahPelatihanKeterampilan: toUndefined(
            initialData.pernahPelatihanKeterampilan,
        ),
        jenisPelatihanDiikuti: initialData.jenisPelatihanDiikuti || [],
        penyelenggaraPelatihan: initialData.penyelenggaraPelatihan || [],
        pelatihanDiinginkan: initialData.pelatihanDiinginkan || [],

        // Section 7: Jaminan Sosial
        jenisJaminanSosial: toUndefined(initialData.jenisJaminanSosial),
        nomorIdentitasJaminan: toUndefined(initialData.nomorIdentitasJaminan),

        // Section 8: Kesehatan
        aksesLayananKesehatan: toUndefined(
            initialData.aksesLayananKesehatan,
        ) as AksesLayananKesehatan | undefined,
        adaPenyakitKronis: toUndefined(initialData.adaPenyakitKronis),
        detailPenyakitKronis: toUndefined(initialData.detailPenyakitKronis),

        // Section 9: Disabilitas
        penyandangDisabilitas: toUndefined(initialData.penyandangDisabilitas),
        jenisDisabilitas: initialData.jenisDisabilitas || [],

        // Section 10: Diskriminasi & Kekerasan
        pernahDiskriminasi: toUndefined(initialData.pernahDiskriminasi) as
            | PernahDiskriminasi
            | undefined,
        jenisDiskriminasi: (initialData.jenisDiskriminasi ||
            []) as JenisDiskriminasi[],
        pelakuDiskriminasi: initialData.pelakuDiskriminasi || [],
        lokasiKejadian: initialData.lokasiKejadian || [],
        diskriminasiDilaporkan: toUndefined(initialData.diskriminasiDilaporkan),

        // Section 11: Bantuan Sosial & Komunitas
        menerimaBantuanSosial: toUndefined(initialData.menerimaBantuanSosial),
        terdaftarDTKS: toUndefined(initialData.terdaftarDTKS),
        bantuanSosialLainnya: initialData.bantuanSosialLainnya || [],
        kelompokKomunitas: toUndefined(initialData.kelompokKomunitas),
    };

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                // Validate form
                const result = formSubmissionSchema.safeParse(value);

                if (!result.success) {
                    const errors = result.error.errors;
                    console.error("=== VALIDATION ERRORS ===");
                    errors.forEach((err, idx) => {
                        console.error(`Error ${idx + 1}:`, {
                            path: err.path.join("."),
                            message: err.message,
                            code: err.code,
                            received:
                                "received" in err ? err.received : undefined,
                        });
                    });
                    console.error("Form value being validated:", value);
                    console.error("=========================");

                    // Show user-friendly toast with field names
                    const errorFields = errors
                        .map((e) => e.path.join("."))
                        .join(", ");
                    toast.error("Validasi gagal", {
                        description: `Kesalahan pada field: ${errorFields}`,
                    });
                    return;
                }

                // Send update to API
                const response = await fetch(
                    `/api/admin/submissions/${initialData.id}/update`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(result.data),
                    },
                );

                const responseData = await response.json();

                if (!response.ok) {
                    console.error("API Error:", responseData);

                    let errorMessage =
                        responseData.error || "Silakan coba lagi nanti";
                    if (responseData.message) {
                        errorMessage = responseData.message;
                    }

                    toast.error("Gagal menyimpan perubahan", {
                        description: errorMessage,
                        duration: 8000,
                    });
                    return;
                }

                toast.success("Perubahan berhasil disimpan!", {
                    description: "Data submission telah diperbarui",
                });

                // Redirect back to detail page
                router.push(`/admin/submissions/${initialData.id}`);
                router.refresh();
            } catch (error) {
                console.error("Submit error:", error);
                toast.error("Terjadi kesalahan", {
                    description:
                        "Gagal menyimpan perubahan. Silakan coba lagi.",
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/submissions/${initialData.id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Edit Submission
                            </h1>
                            <p className="text-muted-foreground">
                                Edit data untuk {fullName}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => form.handleSubmit()}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>

            {/* Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-6"
            >
                {/* Section 1: Data Pribadi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section 1: Data Pribadi</CardTitle>
                        <CardDescription>
                            Informasi identitas diri
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Section1 form={form as unknown as CommunityFormApi} />
                    </CardContent>
                </Card>

                {/* Section 2: Dokumen Kependudukan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Section 2: Dokumen Kependudukan</CardTitle>
                        <CardDescription>
                            Dokumen identitas kependudukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Section2 form={form as unknown as CommunityFormApi} />
                    </CardContent>
                </Card>

                {/* Sections 3-5: Alamat, Kontak, Pekerjaan */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Sections 3-5: Alamat, Kontak & Pekerjaan
                        </CardTitle>
                        <CardDescription>
                            Informasi domisili dan pekerjaan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Section3
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section4
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section5
                                form={form as unknown as CommunityFormApi}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sections 6-11: Pelatihan sampai Komunitas */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Sections 6-11: Pelatihan, Kesehatan & Sosial
                        </CardTitle>
                        <CardDescription>
                            Informasi pelatihan, kesehatan, dan sosial
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Section6
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section7
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section8
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section9
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section10
                                form={form as unknown as CommunityFormApi}
                            />
                            <Section11
                                form={form as unknown as CommunityFormApi}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Link href={`/admin/submissions/${initialData.id}`}>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </>
    );
}
