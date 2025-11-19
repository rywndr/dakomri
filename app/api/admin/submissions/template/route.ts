import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
    try {
        // Get cadmin session
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        // Verify admin
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized: Admin access required" },
                { status: 403 },
            );
        }

        // Define template structure with headers and example data
        const templateData = [
            {
                // Section 1: Data Pribadi
                "Nama Depan*": "Contoh: Budi",
                "Nama Belakang": "Contoh: Santoso",
                "Nama Alias/Panggilan": "Contoh: Budi",
                "Tempat Lahir": "Contoh: Jakarta",
                "Tanggal Lahir (YYYY-MM-DD)": "1990-01-15",
                Usia: "34",
                "Jenis Kelamin": "Pria / Wanita",
                "Identitas Gender": "None / Waria / Lainnya",

                // Section 2: Dokumen Kependudukan
                "NIK*": "1234567890123456",
                "Nomor KK*": "1234567890123456",
                "Status Kepemilikan E-KTP*":
                    "Memiliki / Tidak Memiliki / Dalam Proses",

                // Section 3: Alamat
                "Alamat Lengkap*": "Contoh: Jl. Merdeka No. 123",
                Kelurahan: "Contoh: Tanjungpinang Kota",
                Kecamatan: "Contoh: Tanjungpinang Timur",
                Kabupaten: "Contoh: Kepulauan Riau",
                "Kota*": "Contoh: Tanjungpinang",
                "Status Kependudukan": "Pendatang / Penduduk Tetap",
                "Status Tempat Tinggal":
                    "Bersama orang tua / Rumah pribadi / Sewa/kontrak",

                // Section 4: Kontak
                "Kontak Telepon*": "08123456789",

                // Section 5: Pekerjaan & Ekonomi
                "Status Perkawinan": "Belum Kawin / Kawin / Cerai",
                "Pendidikan Terakhir":
                    "SD / SMP / SMA/SMK / Perguruan Tinggi / Tidak Sekolah",
                "Status Pekerjaan":
                    "Bekerja / Tidak Bekerja / Pelajar Mahasiswa",
                "Jenis Pekerjaan": "Contoh: Wiraswasta",
                "Pendapatan Bulanan (Rp)": "5000000",
                "Memiliki Usaha": "Ya / Tidak",
                "Detail Usaha": "Contoh: Salon kecantikan",

                // Section 6: Pelatihan
                "Pernah Pelatihan Keterampilan": "Ya / Tidak",
                "Jenis Pelatihan Diikuti (pisahkan dengan koma)":
                    "Tata rias, Menjahit",
                "Penyelenggara Pelatihan (pisahkan dengan koma)":
                    "Dinas Tenaga Kerja, PKBI",
                "Pelatihan Diinginkan (pisahkan dengan koma)":
                    "Bahasa Inggris, Komputer",

                // Section 7: Jaminan Sosial
                "Jenis Jaminan Sosial":
                    "Tidak memiliki / BPJS kesehatan / BPJS-TK / Lainnya",
                "Nomor Identitas Jaminan": "1234567890",

                // Section 8: Kesehatan
                "Akses Layanan Kesehatan":
                    "Puskesmas / Rumah Sakit / Klinik / Tidak Pernah",
                "Ada Penyakit Kronis": "Ya / Tidak",
                "Detail Penyakit Kronis": "Contoh: Diabetes",

                // Section 9: Disabilitas
                "Penyandang Disabilitas": "Ya / Tidak",
                "Jenis Disabilitas (pisahkan dengan koma)":
                    "Fisik, Mental, Sensorik, Intelektual",

                // Section 10: Diskriminasi & Kekerasan
                "Pernah Diskriminasi": "Tidak pernah / Pernah mengalami",
                "Jenis Diskriminasi (pisahkan dengan koma)":
                    "Fisik, Ekonomi, Verbal, Seksual, Psikologi, Sosial",
                "Pelaku Diskriminasi (pisahkan dengan koma)":
                    "Keluarga, Tetangga, Aparat",
                "Lokasi Kejadian (pisahkan dengan koma)":
                    "Rumah, Tempat umum, Tempat kerja",
                "Diskriminasi Dilaporkan": "Ya / Tidak",

                // Section 11: Bantuan Sosial & Komunitas
                "Menerima Bantuan Sosial": "Ya / Tidak",
                "Terdaftar DTKS": "Ya / Tidak",
                "Bantuan Sosial Lainnya (pisahkan dengan koma)":
                    "PKH, BPNT, BLT",
                "Kelompok Komunitas": "Contoh: Komunitas Waria Bintan",
            },
        ];

        // Instruksi
        const instructions = [
            ["PANDUAN PENGISIAN TEMPLATE UPLOAD MASSAL"],
            [""],
            ["PENTING:"],
            [
                "1. JANGAN HAPUS atau UBAH baris header (baris pertama dengan nama kolom)",
            ],
            ["2. Field yang ditandai dengan tanda * WAJIB diisi"],
            ["3. Hapus baris contoh ini sebelum mengupload"],
            [
                "4. Untuk field dengan pilihan, pilih salah satu opsi yang tertera",
            ],
            [
                "5. Untuk field yang dapat diisi banyak nilai, pisahkan dengan koma (,)",
            ],
            ["6. Format tanggal: YYYY-MM-DD (contoh: 1990-01-15)"],
            ["7. NIK dan Nomor KK harus 16 digit angka"],
            ["8. Nomor telepon diawali dengan 08 atau +62"],
            [
                "9. Pendapatan dalam Rupiah tanpa titik atau koma (contoh: 5000000)",
            ],
            ["10. Untuk field Ya/Tidak, isi dengan 'Ya' atau 'Tidak' saja"],
            [""],
            ["CATATAN FIELD PILIHAN:"],
            [""],
            ["Jenis Kelamin: Pria / Wanita"],
            ["Identitas Gender: None / Waria / (atau isi custom)"],
            [
                "Status Kepemilikan E-KTP: Memiliki / Tidak Memiliki / Dalam Proses",
            ],
            ["Status Kependudukan: Pendatang / Penduduk Tetap"],
            [
                "Status Tempat Tinggal: Bersama orang tua / Rumah pribadi / Sewa/kontrak",
            ],
            ["Status Perkawinan: Belum Kawin / Kawin / Cerai"],
            [
                "Pendidikan Terakhir: SD / SMP / SMA/SMK / Perguruan Tinggi / Tidak Sekolah",
            ],
            ["Status Pekerjaan: Bekerja / Tidak Bekerja / Pelajar Mahasiswa"],
            [
                "Jenis Jaminan Sosial: Tidak memiliki / BPJS kesehatan / BPJS-TK / (atau isi custom)",
            ],
            [
                "Akses Layanan Kesehatan: Puskesmas / Rumah Sakit / Klinik / Tidak Pernah",
            ],
            ["Pernah Diskriminasi: Tidak pernah / Pernah mengalami"],
            [""],
            [
                "Jenis Diskriminasi (dapat lebih dari 1): Fisik, Ekonomi, Verbal, Seksual, Psikologi, Sosial",
            ],
            [
                "Jenis Disabilitas (dapat lebih dari 1): Fisik, Mental, Sensorik, Intelektual",
            ],
            [""],
            [
                "Jika ada pertanyaan, hubungi admin atau lihat contoh pada sheet 'Data Template'",
            ],
        ];

        // Excel workbook 2 sheet
        const workbook = XLSX.utils.book_new();

        // Add instructions sheet
        const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
        // Set column widths for instructions
        instructionsSheet["!cols"] = [{ wch: 100 }];
        XLSX.utils.book_append_sheet(
            workbook,
            instructionsSheet,
            "Panduan Pengisian",
        );

        // Add data template sheet
        const dataSheet = XLSX.utils.json_to_sheet(templateData);
        // Set column widths to auto-fit
        const maxWidth = 30;
        const cols = Object.keys(templateData[0]).map((key) => ({
            wch: Math.min(key.length + 2, maxWidth),
        }));
        dataSheet["!cols"] = cols;
        XLSX.utils.book_append_sheet(workbook, dataSheet, "Data Template");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });

        // Return file as download
        return new NextResponse(excelBuffer, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                    'attachment; filename="template_pengajuan_waria.xlsx"',
            },
        });
    } catch (error) {
        console.error("Error generating template:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat membuat template",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
