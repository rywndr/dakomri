import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { formSubmissionSchema } from "@/lib/validations/form-validation";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Get current admin session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // Verify admin access
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized: Admin access required" },
                { status: 403 },
            );
        }

        const adminId = session.user.id;

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

        // Generate ID unik
        const submissionId = nanoid();

        // Prepare data untuk database - NO userId (admin-created, unlinked)
        const submissionData = {
            id: submissionId,
            userId: null, // Explicitly null - not linked to any user

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

            // Status: verified automatically (admin created)
            status: "verified",
            createdBy: adminId, // Track which admin created this
            verifiedBy: adminId, // Auto-verified by the creating admin
            verifiedAt: new Date(),
        };

        // Insert ke database
        await db.insert(formSubmission).values(submissionData);

        return NextResponse.json(
            {
                success: true,
                message:
                    "Pengajuan berhasil dibuat tanpa akun pengguna terhubung",
                submissionId,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Admin form submission error:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat menyimpan formulir",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
