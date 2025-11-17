import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Tidak terautentikasi" },
                { status: 401 },
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                {
                    error: "Akses ditolak. Hanya admin yang dapat mengekspor data",
                },
                { status: 403 },
            );
        }

        // Get format from query params
        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "excel";

        if (!["pdf", "excel"].includes(format)) {
            return NextResponse.json(
                { error: "Format tidak valid. Gunakan 'pdf' atau 'excel'" },
                { status: 400 },
            );
        }

        // Fetch all verified community members with ALL fields
        const members = await db
            .select({
                id: formSubmission.id,
                // Section 1: Data Pribadi
                namaDepan: formSubmission.namaDepan,
                namaBelakang: formSubmission.namaBelakang,
                namaAlias: formSubmission.namaAlias,
                tempatLahir: formSubmission.tempatLahir,
                tanggalLahir: formSubmission.tanggalLahir,
                usia: formSubmission.usia,
                jenisKelamin: formSubmission.jenisKelamin,
                identitasGender: formSubmission.identitasGender,
                // Section 2: Dokumen Kependudukan
                nik: formSubmission.nik,
                nomorKK: formSubmission.nomorKK,
                statusKepemilikanEKTP: formSubmission.statusKepemilikanEKTP,
                // Section 3: Alamat
                alamatLengkap: formSubmission.alamatLengkap,
                kelurahan: formSubmission.kelurahan,
                kecamatan: formSubmission.kecamatan,
                kabupaten: formSubmission.kabupaten,
                kota: formSubmission.kota,
                statusKependudukan: formSubmission.statusKependudukan,
                statusTempatTinggal: formSubmission.statusTempatTinggal,
                // Section 4: Kontak
                kontakTelp: formSubmission.kontakTelp,
                // Section 5: Pekerjaan & Ekonomi
                statusPerkawinan: formSubmission.statusPerkawinan,
                pendidikanTerakhir: formSubmission.pendidikanTerakhir,
                statusPekerjaan: formSubmission.statusPekerjaan,
                jenisPekerjaan: formSubmission.jenisPekerjaan,
                pendapatanBulanan: formSubmission.pendapatanBulanan,
                memilikiUsaha: formSubmission.memilikiUsaha,
                detailUsaha: formSubmission.detailUsaha,
                // Section 6: Pelatihan
                pernahPelatihanKeterampilan:
                    formSubmission.pernahPelatihanKeterampilan,
                jenisPelatihanDiikuti: formSubmission.jenisPelatihanDiikuti,
                penyelenggaraPelatihan: formSubmission.penyelenggaraPelatihan,
                pelatihanDiinginkan: formSubmission.pelatihanDiinginkan,
                // Section 7: Jaminan Sosial
                jenisJaminanSosial: formSubmission.jenisJaminanSosial,
                nomorIdentitasJaminan: formSubmission.nomorIdentitasJaminan,
                // Section 8: Kesehatan
                aksesLayananKesehatan: formSubmission.aksesLayananKesehatan,
                adaPenyakitKronis: formSubmission.adaPenyakitKronis,
                detailPenyakitKronis: formSubmission.detailPenyakitKronis,
                // Section 9: Disabilitas
                penyandangDisabilitas: formSubmission.penyandangDisabilitas,
                jenisDisabilitas: formSubmission.jenisDisabilitas,
                // Section 10: Diskriminasi & Kekerasan
                pernahDiskriminasi: formSubmission.pernahDiskriminasi,
                jenisDiskriminasi: formSubmission.jenisDiskriminasi,
                pelakuDiskriminasi: formSubmission.pelakuDiskriminasi,
                lokasiKejadian: formSubmission.lokasiKejadian,
                diskriminasiDilaporkan: formSubmission.diskriminasiDilaporkan,
                // Section 11: Bantuan Sosial & Komunitas
                menerimaBantuanSosial: formSubmission.menerimaBantuanSosial,
                terdaftarDTKS: formSubmission.terdaftarDTKS,
                bantuanSosialLainnya: formSubmission.bantuanSosialLainnya,
                kelompokKomunitas: formSubmission.kelompokKomunitas,
                // Metadata
                createdAt: formSubmission.createdAt,
                verifiedAt: formSubmission.verifiedAt,
                status: formSubmission.status,
                userId: formSubmission.userId,
                userName: user.name,
                userEmail: user.email,
            })
            .from(formSubmission)
            .leftJoin(user, eq(formSubmission.userId, user.id))
            .where(eq(formSubmission.status, "verified"));

        if (members.length === 0) {
            return NextResponse.json(
                { error: "Tidak ada data untuk diekspor" },
                { status: 404 },
            );
        }

        // Helper function to parse JSON arrays
        const parseJsonArray = (jsonString: string | null): string => {
            if (!jsonString) return "-";
            try {
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed.join(", ") : "-";
            } catch {
                return jsonString || "-";
            }
        };

        // Helper function to format currency
        const formatCurrency = (amount: string | null): string => {
            if (!amount) return "-";
            const num = parseFloat(amount);
            if (isNaN(num)) return "-";
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(num);
        };

        // Helper function to format boolean
        const formatBoolean = (value: boolean | null): string => {
            if (value === null) return "-";
            return value ? "Ya" : "Tidak";
        };

        // Helper function to format date
        const formatDate = (date: Date | null): string => {
            if (!date) return "-";
            return new Date(date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        };

        // Prepare comprehensive data for export
        const exportData = members.map((member, index) => {
            const fullName = [member.namaDepan, member.namaBelakang]
                .filter(Boolean)
                .join(" ");
            const alamatLengkapFormatted = [
                member.alamatLengkap,
                member.kelurahan,
                member.kecamatan,
                member.kabupaten,
                member.kota,
            ]
                .filter(Boolean)
                .join(", ");

            return {
                // Basic Info
                No: index + 1,
                "Nama Lengkap": fullName,
                "Nama Alias": member.namaAlias || "-",
                "Tempat Lahir": member.tempatLahir || "-",
                "Tanggal Lahir": formatDate(member.tanggalLahir),
                Usia: member.usia ? `${member.usia} tahun` : "-",
                "Jenis Kelamin": member.jenisKelamin || "-",
                "Identitas Gender":
                    member.identitasGender && member.identitasGender !== "None"
                        ? member.identitasGender
                        : "-",

                // Dokumen Kependudukan
                NIK: member.nik || "-",
                "Nomor KK": member.nomorKK || "-",
                "Status e-KTP": member.statusKepemilikanEKTP || "-",

                // Alamat
                "Alamat Lengkap": alamatLengkapFormatted,
                Kelurahan: member.kelurahan || "-",
                Kecamatan: member.kecamatan || "-",
                Kabupaten: member.kabupaten || "-",
                "Kota/Kabupaten": member.kota || "-",
                "Status Kependudukan": member.statusKependudukan || "-",
                "Status Tempat Tinggal": member.statusTempatTinggal || "-",

                // Kontak
                "Nomor Telepon": member.kontakTelp || "-",

                // Pekerjaan & Ekonomi
                "Status Perkawinan": member.statusPerkawinan || "-",
                "Pendidikan Terakhir": member.pendidikanTerakhir || "-",
                "Status Pekerjaan": member.statusPekerjaan || "-",
                "Jenis Pekerjaan": member.jenisPekerjaan || "-",
                "Pendapatan Bulanan": formatCurrency(member.pendapatanBulanan),
                "Memiliki Usaha": formatBoolean(member.memilikiUsaha),
                "Detail Usaha": member.detailUsaha || "-",

                // Pelatihan
                "Pernah Pelatihan Keterampilan": formatBoolean(
                    member.pernahPelatihanKeterampilan,
                ),
                "Jenis Pelatihan yang Diikuti": parseJsonArray(
                    member.jenisPelatihanDiikuti,
                ),
                "Penyelenggara Pelatihan": parseJsonArray(
                    member.penyelenggaraPelatihan,
                ),
                "Pelatihan yang Diinginkan": parseJsonArray(
                    member.pelatihanDiinginkan,
                ),

                // Jaminan Sosial
                "Jenis Jaminan Sosial": member.jenisJaminanSosial || "-",
                "Nomor Identitas Jaminan": member.nomorIdentitasJaminan || "-",

                // Kesehatan
                "Akses Layanan Kesehatan": member.aksesLayananKesehatan || "-",
                "Ada Penyakit Kronis": formatBoolean(member.adaPenyakitKronis),
                "Detail Penyakit Kronis": member.detailPenyakitKronis || "-",

                // Disabilitas
                "Penyandang Disabilitas": formatBoolean(
                    member.penyandangDisabilitas,
                ),
                "Jenis Disabilitas": parseJsonArray(member.jenisDisabilitas),

                // Diskriminasi & Kekerasan
                "Pernah Mengalami Diskriminasi":
                    member.pernahDiskriminasi || "-",
                "Jenis Diskriminasi": parseJsonArray(member.jenisDiskriminasi),
                "Pelaku Diskriminasi": parseJsonArray(
                    member.pelakuDiskriminasi,
                ),
                "Lokasi Kejadian": parseJsonArray(member.lokasiKejadian),
                "Diskriminasi Dilaporkan": formatBoolean(
                    member.diskriminasiDilaporkan,
                ),

                // Bantuan Sosial & Komunitas
                "Menerima Bantuan Sosial": formatBoolean(
                    member.menerimaBantuanSosial,
                ),
                "Terdaftar DTKS": formatBoolean(member.terdaftarDTKS),
                "Bantuan Sosial Lainnya": parseJsonArray(
                    member.bantuanSosialLainnya,
                ),
                "Kelompok Komunitas": member.kelompokKomunitas || "-",

                // Metadata
                "Tanggal Registrasi": formatDate(member.createdAt),
                "Tanggal Verifikasi": formatDate(member.verifiedAt),
                "Nama User": member.userName || "-",
                "Email User": member.userEmail || "-",
            };
        });

        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, "-")
            .slice(0, 19);

        if (format === "excel") {
            // Generate Excel file
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data Komunitas");

            // Set column widths for all columns
            const columnWidths = [
                { wch: 5 }, // No
                { wch: 25 }, // Nama Lengkap
                { wch: 20 }, // Nama Alias
                { wch: 20 }, // Tempat Lahir
                { wch: 18 }, // Tanggal Lahir
                { wch: 12 }, // Usia
                { wch: 15 }, // Jenis Kelamin
                { wch: 18 }, // Identitas Gender
                { wch: 18 }, // NIK
                { wch: 18 }, // Nomor KK
                { wch: 20 }, // Status e-KTP
                { wch: 50 }, // Alamat Lengkap
                { wch: 20 }, // Kelurahan
                { wch: 20 }, // Kecamatan
                { wch: 20 }, // Kabupaten
                { wch: 20 }, // Kota/Kabupaten
                { wch: 20 }, // Status Kependudukan
                { wch: 25 }, // Status Tempat Tinggal
                { wch: 15 }, // Nomor Telepon
                { wch: 18 }, // Status Perkawinan
                { wch: 20 }, // Pendidikan Terakhir
                { wch: 18 }, // Status Pekerjaan
                { wch: 25 }, // Jenis Pekerjaan
                { wch: 20 }, // Pendapatan Bulanan
                { wch: 15 }, // Memiliki Usaha
                { wch: 30 }, // Detail Usaha
                { wch: 28 }, // Pernah Pelatihan Keterampilan
                { wch: 35 }, // Jenis Pelatihan yang Diikuti
                { wch: 30 }, // Penyelenggara Pelatihan
                { wch: 30 }, // Pelatihan yang Diinginkan
                { wch: 25 }, // Jenis Jaminan Sosial
                { wch: 25 }, // Nomor Identitas Jaminan
                { wch: 25 }, // Akses Layanan Kesehatan
                { wch: 20 }, // Ada Penyakit Kronis
                { wch: 30 }, // Detail Penyakit Kronis
                { wch: 23 }, // Penyandang Disabilitas
                { wch: 30 }, // Jenis Disabilitas
                { wch: 30 }, // Pernah Mengalami Diskriminasi
                { wch: 30 }, // Jenis Diskriminasi
                { wch: 30 }, // Pelaku Diskriminasi
                { wch: 30 }, // Lokasi Kejadian
                { wch: 23 }, // Diskriminasi Dilaporkan
                { wch: 25 }, // Menerima Bantuan Sosial
                { wch: 18 }, // Terdaftar DTKS
                { wch: 30 }, // Bantuan Sosial Lainnya
                { wch: 25 }, // Kelompok Komunitas
                { wch: 20 }, // Tanggal Registrasi
                { wch: 20 }, // Tanggal Verifikasi
                { wch: 25 }, // Nama User
                { wch: 30 }, // Email User
            ];
            worksheet["!cols"] = columnWidths;

            // Generate buffer
            const buffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "buffer",
            });

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="komunitas-lengkap-${timestamp}.xlsx"`,
                },
            });
        } else {
            // Generate PDF file with landscape orientation
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            // Add title
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Data Anggota Komunitas", 14, 15);

            // Add export info
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(
                `Diekspor: ${new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })} | Total: ${members.length} anggota`,
                14,
                22,
            );

            const tableData = members.map((member, index) => {
                const fullName = [member.namaDepan, member.namaBelakang]
                    .filter(Boolean)
                    .join(" ");
                const location = [
                    member.kelurahan,
                    member.kecamatan,
                    member.kota,
                ]
                    .filter(Boolean)
                    .join(", ");

                return [
                    index + 1,
                    fullName,
                    member.usia ? `${member.usia} thn` : "-",
                    member.jenisKelamin || "-",
                    member.identitasGender && member.identitasGender !== "None"
                        ? member.identitasGender
                        : "-",
                    member.nik || "-",
                    location || member.kota || "-",
                    member.kontakTelp || "-",
                    member.pendidikanTerakhir || "-",
                    member.statusPekerjaan || "-",
                    member.jenisPekerjaan || "-",
                    formatDate(member.verifiedAt),
                ];
            });

            autoTable(doc, {
                head: [
                    [
                        "No",
                        "Nama Lengkap",
                        "Usia",
                        "Jenis Kelamin",
                        "Identitas Gender",
                        "NIK",
                        "Lokasi",
                        "Kontak",
                        "Pendidikan",
                        "Status Kerja",
                        "Jenis Kerja",
                        "Tgl Verifikasi",
                    ],
                ],
                body: tableData,
                startY: 28,
                styles: {
                    fontSize: 8,
                    cellPadding: 2.5,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                    valign: "middle",
                },
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255,
                    fontStyle: "bold",
                    fontSize: 8.5,
                    halign: "center",
                    cellPadding: 3,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: 10, halign: "center" }, // No
                    1: { cellWidth: 35 }, // Nama
                    2: { cellWidth: 12, halign: "center" }, // Usia
                    3: { cellWidth: 18 }, // Jenis Kelamin
                    4: { cellWidth: 22 }, // Identitas Gender
                    5: { cellWidth: 28 }, // NIK
                    6: { cellWidth: 45 }, // Lokasi
                    7: { cellWidth: 20 }, // Kontak
                    8: { cellWidth: 25 }, // Pendidikan
                    9: { cellWidth: 20 }, // Status Kerja
                    10: { cellWidth: 30 }, // Jenis Kerja
                    11: { cellWidth: 20 }, // Tgl Verifikasi
                },
                margin: { top: 28, right: 7, bottom: 10, left: 7 },
                theme: "grid",
            });

            // Generate PDF buffer
            const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

            return new NextResponse(pdfBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="komunitas-${timestamp}.pdf"`,
                },
            });
        }
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json(
            { error: "Gagal mengekspor data" },
            { status: 500 },
        );
    }
}
