import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import {
    revalidateFormStatus,
    revalidateSubmissions,
    revalidateStatistics,
} from "@/lib/revalidate";

/**
 * POST /api/form/submit
 * Submit formulir untuk verifikasi admin
 * Revalidates caches setelah submission berhasil
 */
export async function POST(req: Request) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Get current user
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const user = session?.user;

        // Parse request body
        const body = await req.json();

        // Validasi data dengan Zod
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

        // Check for duplicate NIK
        const [duplicateNik] = await db
            .select({ id: formSubmission.id })
            .from(formSubmission)
            .where(eq(formSubmission.nik, data.nik))
            .limit(1);

        if (duplicateNik) {
            return NextResponse.json(
                {
                    error: "NIK sudah terdaftar",
                    message:
                        "NIK yang dimasukkan sudah digunakan. Setiap orang hanya dapat mengisi formulir satu kali.",
                },
                { status: 400 },
            );
        }

        // Check for duplicate Nomor KK
        const [duplicateKK] = await db
            .select({ id: formSubmission.id })
            .from(formSubmission)
            .where(eq(formSubmission.nomorKK, data.nomorKK))
            .limit(1);

        if (duplicateKK) {
            return NextResponse.json(
                {
                    error: "Nomor KK sudah terdaftar",
                    message:
                        "Nomor KK yang dimasukkan sudah digunakan. Setiap Kartu Keluarga hanya dapat digunakan satu kali.",
                },
                { status: 400 },
            );
        }

        // Generate ID unik
        const submissionId = nanoid();

        // Prepare data untuk database
        const submissionData = {
            id: submissionId,
            userId: user?.id || null,

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
            nomorKK: data.nomorKK,
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
            statusPerkawinan: data.statusPerkawinan || null,
            pendidikanTerakhir: data.pendidikanTerakhir || null,
            statusPekerjaan: data.statusPekerjaan || null,
            jenisPekerjaan: data.jenisPekerjaan || null,
            pendapatanBulanan: data.pendapatanBulanan?.toString() || null,
            memilikiUsaha: data.memilikiUsaha || null,
            detailUsaha: data.detailUsaha || null,

            // Section 6: Pelatihan (convert arrays to JSON)
            pernahPelatihanKeterampilan:
                data.pernahPelatihanKeterampilan || null,
            jenisPelatihanDiikuti: JSON.stringify(
                data.jenisPelatihanDiikuti || [],
            ),
            penyelenggaraPelatihan: JSON.stringify(
                data.penyelenggaraPelatihan || [],
            ),
            pelatihanDiinginkan: JSON.stringify(data.pelatihanDiinginkan || []),

            // Section 7: Jaminan Sosial
            jenisJaminanSosial: data.jenisJaminanSosial || null,
            nomorIdentitasJaminan: data.nomorIdentitasJaminan || null,

            // Section 8: Kesehatan
            aksesLayananKesehatan: data.aksesLayananKesehatan || null,
            adaPenyakitKronis: data.adaPenyakitKronis || null,
            detailPenyakitKronis: data.detailPenyakitKronis || null,

            // Section 9: Disabilitas
            penyandangDisabilitas: data.penyandangDisabilitas || null,
            jenisDisabilitas: JSON.stringify(data.jenisDisabilitas || []),

            // Section 10: Diskriminasi & Kekerasan
            pernahDiskriminasi: data.pernahDiskriminasi || null,
            jenisDiskriminasi: JSON.stringify(data.jenisDiskriminasi || []),
            pelakuDiskriminasi: JSON.stringify(data.pelakuDiskriminasi || []),
            lokasiKejadian: JSON.stringify(data.lokasiKejadian || []),
            diskriminasiDilaporkan: data.diskriminasiDilaporkan || null,

            // Section 11: Bantuan Sosial & Komunitas
            menerimaBantuanSosial: data.menerimaBantuanSosial || null,
            terdaftarDTKS: data.terdaftarDTKS || null,
            bantuanSosialLainnya: JSON.stringify(
                data.bantuanSosialLainnya || [],
            ),
            kelompokKomunitas: data.kelompokKomunitas || null,

            // Status: submitted menunggu verifikasi admin
            status: "submitted",
        };

        // Insert ke database
        await db.insert(formSubmission).values(submissionData);

        // Revalidate caches setelah submission berhasil
        // 1. Revalidate form status untuk user ini
        if (user?.id) {
            await revalidateFormStatus(user.id);
        }
        // 2. Revalidate admin submissions cache
        await revalidateSubmissions();
        // 3. Revalidate statistics (new submission affects stats)
        await revalidateStatistics();
        // 4. Revalidate form page path for immediate status refresh
        revalidatePath("/form");

        return NextResponse.json(
            {
                success: true,
                message:
                    "Formulir berhasil dikirim dan menunggu verifikasi admin",
                submissionId,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Form submission error:", error);

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
                            "NIK yang dimasukkan sudah digunakan. Setiap orang hanya dapat mengisi formulir satu kali.",
                    },
                    { status: 400 },
                );
            }
            if (errorMessage.includes("nomor_kk")) {
                return NextResponse.json(
                    {
                        error: "Nomor KK sudah terdaftar",
                        message:
                            "Nomor KK yang dimasukkan sudah digunakan. Setiap Kartu Keluarga hanya dapat digunakan satu kali.",
                    },
                    { status: 400 },
                );
            }
        }

        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat menyimpan formulir",
                details: errorMessage,
            },
            { status: 500 },
        );
    }
}
