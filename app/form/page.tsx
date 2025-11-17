"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
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

/**
 * Form ini terdiri dari 11 section dengan validasi lengkap
 */
export default function FormPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<{
        hasSubmitted: boolean;
        status: string | null;
    }>({ hasSubmitted: false, status: null });
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);
    const { data: session } = authClient.useSession();
    const formRef = useRef<HTMLFormElement>(null);

    /**
     * Check if user has already submitted the form
     */
    useEffect(() => {
        const checkSubmissionStatus = async () => {
            try {
                const response = await fetch("/api/form/status");
                const data = await response.json();
                setSubmissionStatus({
                    hasSubmitted: data.hasSubmitted || false,
                    status: data.status || null,
                });
            } catch (error) {
                console.error("Failed to check submission status:", error);
            } finally {
                setIsCheckingStatus(false);
            }
        };

        if (session?.user) {
            checkSubmissionStatus();
        } else {
            setIsCheckingStatus(false);
        }
    }, [session]);

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
        },
        onSubmit: async ({ value }) => {
            // Check if user has already submitted
            if (submissionStatus.hasSubmitted) {
                toast.error("Anda sudah pernah submit formulir", {
                    description:
                        "Setiap pengguna hanya dapat mengisi formulir sekali.",
                });
                return;
            }

            setIsLoading(true);
            try {
                // Validasi seluruh form dengan Zod
                const result = formSubmissionSchema.safeParse(value);

                if (!result.success) {
                    const errors = result.error.errors;
                    toast.error("Validasi gagal", {
                        description: `Ada ${errors.length} kesalahan dalam form. Silakan periksa kembali.`,
                    });
                    console.error("Validation errors:", errors);

                    return;
                }

                // Kirim data ke API endpoint
                const response = await fetch("/api/form/submit", {
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

                toast.success("Formulir berhasil dikirim!", {
                    description:
                        "Data Anda akan diverifikasi oleh admin terlebih dahulu",
                });

                // Redirect ke halaman success
                router.push("/form/success");
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

    // Show loading while checking status
    if (isCheckingStatus) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Section skeleton */}
                        {[1, 2, 3, 4, 5, 6].map((section) => (
                            <div key={section} className="space-y-6">
                                <div>
                                    <Skeleton className="h-6 w-48 mb-1" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                                {section < 6 && <Separator />}
                            </div>
                        ))}
                        {/* Action buttons skeleton */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Skeleton className="h-10 flex-1" />
                        </div>
                        {/* Info note skeleton */}
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show message if user has already submitted
    if (submissionStatus.hasSubmitted) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">
                            Formulir Sudah Tersubmit
                        </CardTitle>
                        <CardDescription>
                            Anda sudah pernah mengisi dan mengirim formulir ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm mb-2">
                                <strong>Status:</strong>{" "}
                                {submissionStatus.status === "submitted" && (
                                    <span className="text-yellow-600">
                                        Menunggu Verifikasi
                                    </span>
                                )}
                                {submissionStatus.status === "verified" && (
                                    <span className="text-green-600">
                                        Terverifikasi
                                    </span>
                                )}
                                {submissionStatus.status === "rejected" && (
                                    <span className="text-red-600">
                                        Ditolak
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Setiap pengguna hanya dapat mengisi formulir
                                sekali. Jika ada perubahan data, silakan hubungi
                                admin.
                            </p>
                        </div>
                        <Button onClick={() => router.push("/")}>
                            Kembali ke Beranda
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">
                        Formulir Pendataan Komunitas
                    </CardTitle>
                    <CardDescription>
                        Formulir untuk pendataan anggota komunitas waria. Semua
                        data yang dikumpulkan akan dijaga kerahasiaannya.
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
                        <Section1 form={form} />
                        <Separator />

                        {/* Section 2: Dokumen Kependudukan */}
                        <Section2 form={form} />
                        <Separator />

                        {/* Section 3: Alamat */}
                        <Section3 form={form} />
                        <Separator />

                        {/* Section 4: Kontak */}
                        <Section4 form={form} />
                        <Separator />

                        {/* Section 5: Pekerjaan & Ekonomi */}
                        <Section5 form={form} />
                        <Separator />

                        {/* Section 6: Pelatihan */}
                        <Section6 form={form} />
                        <Separator />

                        {/* Section 7: Jaminan Sosial */}
                        <Section7 form={form} />
                        <Separator />

                        {/* Section 8: Kesehatan */}
                        <Section8 form={form} />
                        <Separator />

                        {/* Section 9: Disabilitas */}
                        <Section9 form={form} />
                        <Separator />

                        {/* Section 10: Diskriminasi & Kekerasan */}
                        <Section10 form={form} />
                        <Separator />

                        {/* Section 11: Bantuan Sosial & Komunitas */}
                        <Section11 form={form} />

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Mengirim...
                                    </>
                                ) : (
                                    "Submit Formulir"
                                )}
                            </Button>
                        </div>

                        {/* Info Note */}
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <span className="text-destructive">*</span>{" "}
                                Menandakan field yang wajib diisi. Data Anda
                                akan dijaga kerahasiaannya dan hanya digunakan
                                untuk keperluan pendataan komunitas.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
