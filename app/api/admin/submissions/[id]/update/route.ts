import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { eq, and, ne } from "drizzle-orm";
import { revalidateSubmissions, revalidateSubmission } from "@/lib/revalidate";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Check if user is authenticated and is an admin
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        // Parse request body
        const body = await request.json();

        // Validate data dgn Zod
        const validation = formSubmissionSchema.safeParse(body);

        if (!validation.success) {
            console.error("Form validation failed:", validation.error.errors);
            return NextResponse.json(
                {
                    error: "Validasi gagal",
                    details: validation.error.errors,
                    message: validation.error.errors
                        .map((err) => `${err.path.join(".")}: ${err.message}`)
                        .join(", "),
                },
                { status: 400 },
            );
        }

        const data = validation.data;

        // Check if submission exists
        const [existingSubmission] = await db
            .select()
            .from(formSubmission)
            .where(eq(formSubmission.id, id))
            .limit(1);

        if (!existingSubmission) {
            return NextResponse.json(
                { error: "Submission not found" },
                { status: 404 },
            );
        }

        // Check for duplicate NIK (excluding current submission)
        const [duplicateNik] = await db
            .select({ id: formSubmission.id })
            .from(formSubmission)
            .where(
                and(
                    eq(formSubmission.nik, data.nik),
                    ne(formSubmission.id, id),
                ),
            )
            .limit(1);

        if (duplicateNik) {
            return NextResponse.json(
                {
                    error: "NIK sudah terdaftar",
                    message:
                        "NIK yang dimasukkan sudah digunakan oleh submission lain.",
                },
                { status: 400 },
            );
        }

        // Check for duplicate Nomor KK (excluding current submission, only if provided)
        if (data.nomorKK) {
            const [duplicateKK] = await db
                .select({ id: formSubmission.id })
                .from(formSubmission)
                .where(
                    and(
                        eq(formSubmission.nomorKK, data.nomorKK),
                        ne(formSubmission.id, id),
                    ),
                )
                .limit(1);

            if (duplicateKK) {
                return NextResponse.json(
                    {
                        error: "Nomor KK sudah terdaftar",
                        message:
                            "Nomor KK yang dimasukkan sudah digunakan oleh submission lain.",
                    },
                    { status: 400 },
                );
            }
        }

        // Prepare data for database update
        const updateData = {
            // Section 1: Data Pribadi
            namaDepan: data.namaDepan,
            namaBelakang: data.namaBelakang || null,
            namaAlias: data.namaAlias || null,
            tempatLahir: data.tempatLahir || null,
            tanggalLahir: data.tanggalLahir || null,
            usia: data.usia || null,
            jenisKelamin: data.jenisKelamin || null,
            identitasGender: data.identitasGender || null,

            // Section 2: Dokumen Kependudukan
            nik: data.nik,
            nomorKK: data.nomorKK || null, // Optional field
            statusKepemilikanEKTP: data.statusKepemilikanEKTP,

            // Section 3: Alamat
            alamatLengkap: data.alamatLengkap,
            kelurahan: data.kelurahan || null,
            kecamatan: data.kecamatan || null,
            kabupaten: data.kabupaten || null,
            kota: data.kota,
            statusKependudukan: data.statusKependudukan || null,
            statusTempatTinggal: data.statusTempatTinggal || null,

            // Section 4: Kontak
            kontakTelp: data.kontakTelp,

            // Section 5: Pekerjaan & Ekonomi
            statusPerkawinan: data.statusPerkawinan, // Mandatory field
            pendidikanTerakhir: data.pendidikanTerakhir, // Mandatory field
            statusPekerjaan: data.statusPekerjaan || null,
            jenisPekerjaan: data.jenisPekerjaan || null,
            pendapatanBulanan: data.pendapatanBulanan?.toString() || null,
            memilikiUsaha: data.memilikiUsaha || null,
            detailUsaha: data.detailUsaha || null,

            // Section 6: Pelatihan (convert arrays to JSON)
            pernahPelatihanKeterampilan:
                data.pernahPelatihanKeterampilan || null,
            jenisPelatihanDiikuti:
                data.jenisPelatihanDiikuti &&
                Array.isArray(data.jenisPelatihanDiikuti) &&
                data.jenisPelatihanDiikuti.length > 0
                    ? JSON.stringify(data.jenisPelatihanDiikuti)
                    : null,
            penyelenggaraPelatihan:
                data.penyelenggaraPelatihan &&
                Array.isArray(data.penyelenggaraPelatihan) &&
                data.penyelenggaraPelatihan.length > 0
                    ? JSON.stringify(data.penyelenggaraPelatihan)
                    : null,
            pelatihanDiinginkan:
                data.pelatihanDiinginkan &&
                Array.isArray(data.pelatihanDiinginkan) &&
                data.pelatihanDiinginkan.length > 0
                    ? JSON.stringify(data.pelatihanDiinginkan)
                    : null,

            // Section 7: Jaminan Sosial
            jenisJaminanSosial: data.jenisJaminanSosial || null,
            nomorIdentitasJaminan: data.nomorIdentitasJaminan || null,

            // Section 8: Kesehatan
            aksesLayananKesehatan: data.aksesLayananKesehatan || null,
            adaPenyakitKronis: data.adaPenyakitKronis || null,
            detailPenyakitKronis: data.detailPenyakitKronis || null,

            // Section 9: Disabilitas
            penyandangDisabilitas: data.penyandangDisabilitas || null,
            jenisDisabilitas:
                data.jenisDisabilitas &&
                Array.isArray(data.jenisDisabilitas) &&
                data.jenisDisabilitas.length > 0
                    ? JSON.stringify(data.jenisDisabilitas)
                    : null,

            // Section 10: Diskriminasi & Kekerasan
            pernahDiskriminasi: data.pernahDiskriminasi || null,
            jenisDiskriminasi:
                data.jenisDiskriminasi &&
                Array.isArray(data.jenisDiskriminasi) &&
                data.jenisDiskriminasi.length > 0
                    ? JSON.stringify(data.jenisDiskriminasi)
                    : null,
            pelakuDiskriminasi:
                data.pelakuDiskriminasi &&
                Array.isArray(data.pelakuDiskriminasi) &&
                data.pelakuDiskriminasi.length > 0
                    ? JSON.stringify(data.pelakuDiskriminasi)
                    : null,
            lokasiKejadian:
                data.lokasiKejadian &&
                Array.isArray(data.lokasiKejadian) &&
                data.lokasiKejadian.length > 0
                    ? JSON.stringify(data.lokasiKejadian)
                    : null,
            diskriminasiDilaporkan: data.diskriminasiDilaporkan || null,

            // Section 11: Bantuan Sosial & Komunitas
            menerimaBantuanSosial: data.menerimaBantuanSosial || null,
            terdaftarDTKS: data.terdaftarDTKS || null,
            bantuanSosialLainnya:
                data.bantuanSosialLainnya &&
                Array.isArray(data.bantuanSosialLainnya) &&
                data.bantuanSosialLainnya.length > 0
                    ? JSON.stringify(data.bantuanSosialLainnya)
                    : null,
            kelompokKomunitas: data.kelompokKomunitas || null,

            // Update timestamp
            updatedAt: new Date(),
        };

        // Update in database
        const [updatedSubmission] = await db
            .update(formSubmission)
            .set(updateData)
            .where(eq(formSubmission.id, id))
            .returning();

        // Revalidate caches after update
        // 1. Revalidate specific submission cache
        await revalidateSubmission(id);
        // 2. Revalidate admin submissions list cache
        await revalidateSubmissions();
        // 3. Revalidate the submissions page path
        revalidatePath("/admin/submissions");
        revalidatePath(`/admin/submissions/${id}`);

        return NextResponse.json(
            {
                success: true,
                message: "Submission berhasil diperbarui",
                submission: updatedSubmission,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Submission update error:", error);

        // Handle unique constraint violation from database
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        if (
            errorMessage.includes("unique") ||
            errorMessage.includes("duplicate")
        ) {
            if (errorMessage.includes("nik")) {
                return NextResponse.json(
                    {
                        error: "NIK sudah terdaftar",
                        message:
                            "NIK yang dimasukkan sudah digunakan oleh submission lain.",
                    },
                    { status: 400 },
                );
            }
            if (errorMessage.includes("nomor_kk")) {
                return NextResponse.json(
                    {
                        error: "Nomor KK sudah terdaftar",
                        message:
                            "Nomor KK yang dimasukkan sudah digunakan oleh submission lain.",
                    },
                    { status: 400 },
                );
            }
        }

        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat memperbarui submission",
                details: errorMessage,
            },
            { status: 500 },
        );
    }
}
