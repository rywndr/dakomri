"use client";

import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type { CommunityFormApi, FormData } from "@/types/form";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
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

interface AdminFormClientProps {
    onBack?: () => void;
}

export function AdminFormClient({ onBack }: AdminFormClientProps = {}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Initialize TanStack Form
    const form = useForm({
        defaultValues: {
            // Section 1: Data Pribadi
            namaDepan: "",
            namaBelakang: "",
            namaAlias: "",
            tempatLahir: "",
            tanggalLahir: undefined,
            usia: undefined,
            jenisKelamin: undefined,
            identitasGender: "",

            // Section 2: Dokumen Kependudukan
            nik: "",
            nomorKK: "",
            statusKepemilikanEKTP: undefined,

            // Section 3: Alamat
            alamatLengkap: "",
            kelurahan: "",
            kecamatan: "",
            kabupaten: "",
            kota: "",
            statusKependudukan: undefined,
            statusTempatTinggal: undefined,

            // Section 4: Kontak
            kontakTelp: "",

            // Section 5: Pekerjaan & Ekonomi
            statusPerkawinan: undefined,
            pendidikanTerakhir: undefined,
            statusPekerjaan: undefined,
            jenisPekerjaan: "",
            pendapatanBulanan: undefined,
            memilikiUsaha: undefined,
            detailUsaha: "",

            // Section 6: Pelatihan
            pernahPelatihanKeterampilan: undefined,
            jenisPelatihanDiikuti: [],
            penyelenggaraPelatihan: [],
            pelatihanDiinginkan: [],

            // Section 7: Jaminan Sosial
            jenisJaminanSosial: "",
            nomorIdentitasJaminan: "",

            // Section 8: Kesehatan
            aksesLayananKesehatan: undefined,
            adaPenyakitKronis: undefined,
            detailPenyakitKronis: "",

            // Section 9: Disabilitas
            penyandangDisabilitas: undefined,
            jenisDisabilitas: [],

            // Section 10: Diskriminasi & Kekerasan
            pernahDiskriminasi: undefined,
            jenisDiskriminasi: [],
            pelakuDiskriminasi: [],
            lokasiKejadian: [],
            diskriminasiDilaporkan: undefined,

            // Section 11: Bantuan Sosial & Komunitas
            menerimaBantuanSosial: undefined,
            terdaftarDTKS: undefined,
            bantuanSosialLainnya: [],
            kelompokKomunitas: "",
        } as unknown as FormData,
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                // Validasi form w/ Zod
                const result = formSubmissionSchema.safeParse(value);

                if (!result.success) {
                    const errors = result.error.errors;
                    toast.error("Validasi gagal", {
                        description: `Ada ${errors.length} kesalahan dalam form. Silakan periksa kembali.`,
                    });
                    console.error("Validation errors:", errors);

                    return;
                }

                // Kirim data ke API khusus admin
                const response = await fetch("/api/admin/submissions/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(result.data),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    toast.error("Gagal menyimpan data", {
                        description:
                            responseData.error || "Silakan coba lagi nanti",
                    });
                    return;
                }

                toast.success("Pengajuan berhasil dibuat!", {
                    description:
                        "Data pengajuan tanpa akun pengguna berhasil disimpan",
                });

                // Redirect ke halaman komunitas
                router.push("/admin/komunitas");
            } catch (error) {
                console.error("Submit error:", error);
                toast.error("Terjadi kesalahan", {
                    description: "Gagal menyimpan data. Silakan coba lagi.",
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="mb-2 gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight">
                        Buat Pengajuan Baru
                    </h1>
                    <p className="text-muted-foreground">
                        Buat pengajuan pendataan tanpa akun pengguna terhubung
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Formulir Pendataan Komunitas
                    </CardTitle>
                    <CardDescription>
                        Formulir untuk pendataan anggota komunitas waria oleh
                        admin. Pengajuan ini tidak akan terhubung dengan akun
                        pengguna dan dapat di-link kemudian.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        ref={formRef}
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-8"
                    >
                        {/* Section 1: Data Pribadi */}
                        <Section1 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 2: Dokumen Kependudukan */}
                        <Section2 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 3: Alamat */}
                        <Section3 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 4: Kontak */}
                        <Section4 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 5: Pekerjaan & Ekonomi */}
                        <Section5 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 6: Pelatihan */}
                        <Section6 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 7: Jaminan Sosial */}
                        <Section7 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 8: Kesehatan */}
                        <Section8 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 9: Disabilitas */}
                        <Section9 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 10: Diskriminasi & Kekerasan */}
                        <Section10 form={form as unknown as CommunityFormApi} />
                        <Separator />

                        {/* Section 11: Bantuan Sosial & Komunitas */}
                        <Section11 form={form as unknown as CommunityFormApi} />

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/komunitas")}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Pengajuan"
                                )}
                            </Button>
                        </div>

                        {/* Info Note */}
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <span className="text-destructive">*</span>{" "}
                                Menandakan field yang wajib diisi. Pengajuan ini
                                tidak akan terhubung dengan akun pengguna dan
                                dapat di-link dengan pengguna melalui halaman
                                Pengguna.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
