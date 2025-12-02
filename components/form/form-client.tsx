"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommunityFormApi, FormData } from "@/types/form";

import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { validateAndScroll } from "@/lib/form/validation-utils";
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
 * Interface untuk status submission
 */
interface FormStatus {
    hasSubmitted: boolean;
    status: "submitted" | "verified" | "rejected" | null;
}

/**
 * Fetch form status from API
 */
async function fetchFormStatus(): Promise<FormStatus> {
    const response = await fetch("/api/form/status");
    if (!response.ok) return { hasSubmitted: false, status: null };
    return response.json();
}

function FormStatusSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full max-w-xl" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-10 w-40" />
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * FormClient - Client component untuk form pendataan komunitas
 * Uses TanStack Query for form status to stay in sync with navbar
 */
export function FormClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const formRef = useRef<HTMLFormElement>(null);

    // Fetch form status using TanStack Query - same cache as navbar
    const {
        data: formStatus,
        isLoading: isLoadingStatus,
        isFetching,
    } = useQuery({
        queryKey: ["form-status"],
        queryFn: fetchFormStatus,
        staleTime: 1000 * 30, // 30 seconds - match navbar
        refetchOnWindowFocus: true,
    });

    // Inisialisasi TanStack Form
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
            console.log("Form disubmit dengan nilai:", value);
            // Cek apakah user sudah pernah submit
            if (formStatus?.hasSubmitted) {
                toast.error("Anda sudah pernah submit formulir", {
                    description:
                        "Setiap pengguna hanya dapat mengisi formulir sekali.",
                });
                return;
            }

            try {
                // Validasi form dengan Zod
                const result = formSubmissionSchema.safeParse(value);

                if (!result.success) {
                    console.error("Error validasi Zod:", result.error.errors);
                    return;
                }

                // Kirim data ke API
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

                // Invalidate form-status query cache so navbar and this page update
                await queryClient.invalidateQueries({
                    queryKey: ["form-status"],
                });

                // Redirect ke halaman success
                router.push("/form/success");
            } catch (error) {
                console.error("Submit error:", error);
                toast.error("Terjadi kesalahan", {
                    description: "Gagal menyimpan data. Silakan coba lagi.",
                });
            }
        },
    });

    // Show skeleton while loading status
    if (isLoadingStatus) {
        return <FormStatusSkeleton />;
    }

    // Tampilkan pesan jika user sudah submit
    if (formStatus?.hasSubmitted) {
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
                                {formStatus.status === "submitted" && (
                                    <span className="text-yellow-600">
                                        Menunggu Verifikasi
                                    </span>
                                )}
                                {formStatus.status === "verified" && (
                                    <span className="text-green-600">
                                        Terverifikasi
                                    </span>
                                )}
                                {formStatus.status === "rejected" && (
                                    <span className="text-red-600">
                                        Ditolak
                                    </span>
                                )}
                                {isFetching && (
                                    <Spinner className="inline-block ml-2 size-3" />
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

                            // Validasi dengan Zod sebelum submit
                            const currentValues = form.state.values;
                            const isValid = validateAndScroll(
                                currentValues,
                                formSubmissionSchema,
                            );

                            if (!isValid) return;

                            // Jika validasi sukses, submit form
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

                        {/* Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={form.state.isSubmitting}
                                className="flex-1 cursor-pointer"
                            >
                                {form.state.isSubmitting ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Mengirim...
                                    </>
                                ) : (
                                    "Submit Formulir"
                                )}
                            </Button>
                        </div>

                        {/* Catatan Info */}
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
