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

    const form = useForm({
        defaultValues: {
            // Section 1: Data Pribadi
            namaDepan: initialData.namaDepan || "",
            namaBelakang: initialData.namaBelakang || "",
            namaAlias: initialData.namaAlias || "",
            tempatLahir: initialData.tempatLahir || "",
            tanggalLahir: initialData.tanggalLahir || undefined,
            usia: initialData.usia || undefined,
            jenisKelamin: initialData.jenisKelamin || "",
            identitasGender: initialData.identitasGender || "",

            // Section 2: Dokumen Kependudukan
            nik: initialData.nik || "",
            nomorKK: initialData.nomorKK || "",
            statusKepemilikanEKTP: initialData.statusKepemilikanEKTP || "",

            // Section 3: Alamat
            alamatLengkap: initialData.alamatLengkap || "",
            kelurahan: initialData.kelurahan || "",
            kecamatan: initialData.kecamatan || "",
            kabupaten: initialData.kabupaten || "",
            kota: initialData.kota || "",
            statusKependudukan: initialData.statusKependudukan || "",
            statusTempatTinggal: initialData.statusTempatTinggal || "",

            // Section 4: Kontak
            kontakTelp: initialData.kontakTelp || "",

            // Section 5: Pekerjaan & Ekonomi
            statusPerkawinan: initialData.statusPerkawinan || "",
            pendidikanTerakhir: initialData.pendidikanTerakhir || "",
            statusPekerjaan: initialData.statusPekerjaan || "",
            jenisPekerjaan: initialData.jenisPekerjaan || "",
            pendapatanBulanan: initialData.pendapatanBulanan || undefined,
            memilikiUsaha: initialData.memilikiUsaha || false,
            detailUsaha: initialData.detailUsaha || "",

            // Section 6: Pelatihan
            pernahPelatihanKeterampilan:
                initialData.pernahPelatihanKeterampilan || false,
            jenisPelatihanDiikuti: initialData.jenisPelatihanDiikuti || [],
            penyelenggaraPelatihan: initialData.penyelenggaraPelatihan || [],
            pelatihanDiinginkan: initialData.pelatihanDiinginkan || [],

            // Section 7: Jaminan Sosial
            jenisJaminanSosial: initialData.jenisJaminanSosial || "",
            nomorIdentitasJaminan: initialData.nomorIdentitasJaminan || "",

            // Section 8: Kesehatan
            aksesLayananKesehatan: initialData.aksesLayananKesehatan || "",
            adaPenyakitKronis: initialData.adaPenyakitKronis || false,
            detailPenyakitKronis: initialData.detailPenyakitKronis || "",

            // Section 9: Disabilitas
            penyandangDisabilitas: initialData.penyandangDisabilitas || false,
            jenisDisabilitas: initialData.jenisDisabilitas || [],

            // Section 10: Diskriminasi & Kekerasan
            pernahDiskriminasi: initialData.pernahDiskriminasi || "",
            jenisDiskriminasi: initialData.jenisDiskriminasi || [],
            pelakuDiskriminasi: initialData.pelakuDiskriminasi || [],
            lokasiKejadian: initialData.lokasiKejadian || [],
            diskriminasiDilaporkan: initialData.diskriminasiDilaporkan || false,

            // Section 11: Bantuan Sosial & Komunitas
            menerimaBantuanSosial: initialData.menerimaBantuanSosial || false,
            terdaftarDTKS: initialData.terdaftarDTKS || false,
            bantuanSosialLainnya: initialData.bantuanSosialLainnya || [],
            kelompokKomunitas: initialData.kelompokKomunitas || "",
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                // Validate form
                const result = formSubmissionSchema.safeParse(value);

                if (!result.success) {
                    const errors = result.error.errors;
                    toast.error("Validasi gagal", {
                        description: `Ada ${errors.length} kesalahan dalam form. Silakan periksa kembali.`,
                    });
                    console.error("Validation errors:", errors);
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
                        <Section1 form={form} />
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
                        <Section2 form={form} />
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
                            <Section3 form={form} />
                            <Section4 form={form} />
                            <Section5 form={form} />
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
                            <Section6 form={form} />
                            <Section7 form={form} />
                            <Section8 form={form} />
                            <Section9 form={form} />
                            <Section10 form={form} />
                            <Section11 form={form} />
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
