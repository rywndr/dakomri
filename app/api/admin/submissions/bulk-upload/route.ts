import { NextRequest, NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Get admin session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // Verify admin
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized: Admin access required" },
                { status: 403 },
            );
        }

        const adminId = session.user.id;

        // Parse form data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 },
            );
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size exceeds 10MB limit" },
                { status: 400 },
            );
        }

        // Read file buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse Excel file
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName =
            workbook.SheetNames.find((name) => name === "Data Template") ||
            workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData: Record<string, unknown>[] =
            XLSX.utils.sheet_to_json(worksheet);

        if (!rawData || rawData.length === 0) {
            return NextResponse.json(
                { error: "File is empty or no data found" },
                { status: 400 },
            );
        }

        const results = {
            successCount: 0,
            errorCount: 0,
            errors: [] as Array<{ row: number; message: string }>,
        };

        // Process tiap row
        for (let i = 0; i < rawData.length; i++) {
            const rowIndex = i + 2; // +2 karna header row and 0-index
            const row = rawData[i];

            try {
                // Validate required fields
                const requiredFields = [
                    { key: "Nama Depan*", name: "Nama Depan" },
                    { key: "NIK*", name: "NIK" },
                    { key: "Nomor KK*", name: "Nomor KK" },
                    { key: "Status Kepemilikan E-KTP*", name: "Status E-KTP" },
                    { key: "Alamat Lengkap*", name: "Alamat" },
                    { key: "Kota*", name: "Kota" },
                    { key: "Kontak Telepon*", name: "Kontak Telepon" },
                ];

                for (const field of requiredFields) {
                    if (
                        !row[field.key] ||
                        String(row[field.key]).trim() === ""
                    ) {
                        throw new Error(`${field.name} wajib diisi`);
                    }
                }

                // Parse and prepare data
                const submissionData = {
                    id: nanoid(),
                    userId: null,
                    createdBy: adminId,

                    // Section 1: Data Pribadi
                    namaDepan: String(row["Nama Depan*"]).trim(),
                    namaBelakang: row["Nama Belakang"]
                        ? String(row["Nama Belakang"]).trim()
                        : null,
                    namaAlias: row["Nama Alias/Panggilan"]
                        ? String(row["Nama Alias/Panggilan"]).trim()
                        : null,
                    tempatLahir: row["Tempat Lahir"]
                        ? String(row["Tempat Lahir"]).trim()
                        : null,
                    tanggalLahir: row["Tanggal Lahir (YYYY-MM-DD)"]
                        ? new Date(String(row["Tanggal Lahir (YYYY-MM-DD)"]))
                        : null,
                    usia: row["Usia"] ? parseInt(String(row["Usia"])) : null,
                    jenisKelamin: row["Jenis Kelamin"]
                        ? String(row["Jenis Kelamin"]).trim()
                        : null,
                    identitasGender: row["Identitas Gender"]
                        ? String(row["Identitas Gender"]).trim()
                        : null,

                    // Section 2: Dokumen Kependudukan
                    nik: String(row["NIK*"]).trim(),
                    nomorKK: String(row["Nomor KK*"]).trim(),
                    statusKepemilikanEKTP: String(
                        row["Status Kepemilikan E-KTP*"],
                    ).trim(),

                    // Section 3: Alamat
                    alamatLengkap: String(row["Alamat Lengkap*"]).trim(),
                    kelurahan: row["Kelurahan"]
                        ? String(row["Kelurahan"]).trim()
                        : null,
                    kecamatan: row["Kecamatan"]
                        ? String(row["Kecamatan"]).trim()
                        : null,
                    kabupaten: row["Kabupaten"]
                        ? String(row["Kabupaten"]).trim()
                        : null,
                    kota: String(row["Kota*"]).trim(),
                    statusKependudukan: row["Status Kependudukan"]
                        ? String(row["Status Kependudukan"]).trim()
                        : null,
                    statusTempatTinggal: row["Status Tempat Tinggal"]
                        ? String(row["Status Tempat Tinggal"]).trim()
                        : null,

                    // Section 4: Kontak
                    kontakTelp: String(row["Kontak Telepon*"]).trim(),

                    // Section 5: Pekerjaan & Ekonomi
                    statusPerkawinan: row["Status Perkawinan"]
                        ? String(row["Status Perkawinan"]).trim()
                        : null,
                    pendidikanTerakhir: row["Pendidikan Terakhir"]
                        ? String(row["Pendidikan Terakhir"]).trim()
                        : null,
                    statusPekerjaan: row["Status Pekerjaan"]
                        ? String(row["Status Pekerjaan"]).trim()
                        : null,
                    jenisPekerjaan: row["Jenis Pekerjaan"]
                        ? String(row["Jenis Pekerjaan"]).trim()
                        : null,
                    pendapatanBulanan: row["Pendapatan Bulanan (Rp)"]
                        ? String(row["Pendapatan Bulanan (Rp)"])
                        : null,
                    memilikiUsaha: row["Memiliki Usaha"]
                        ? String(row["Memiliki Usaha"]).toLowerCase() === "ya"
                        : null,
                    detailUsaha: row["Detail Usaha"]
                        ? String(row["Detail Usaha"]).trim()
                        : null,

                    // Section 6: Pelatihan
                    pernahPelatihanKeterampilan: row[
                        "Pernah Pelatihan Keterampilan"
                    ]
                        ? String(
                              row["Pernah Pelatihan Keterampilan"],
                          ).toLowerCase() === "ya"
                        : null,
                    jenisPelatihanDiikuti: row[
                        "Jenis Pelatihan Diikuti (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Jenis Pelatihan Diikuti (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    penyelenggaraPelatihan: row[
                        "Penyelenggara Pelatihan (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Penyelenggara Pelatihan (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    pelatihanDiinginkan: row[
                        "Pelatihan Diinginkan (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Pelatihan Diinginkan (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),

                    // Section 7: Jaminan Sosial
                    jenisJaminanSosial: row["Jenis Jaminan Sosial"]
                        ? String(row["Jenis Jaminan Sosial"]).trim()
                        : null,
                    nomorIdentitasJaminan: row["Nomor Identitas Jaminan"]
                        ? String(row["Nomor Identitas Jaminan"]).trim()
                        : null,

                    // Section 8: Kesehatan
                    aksesLayananKesehatan: row["Akses Layanan Kesehatan"]
                        ? String(row["Akses Layanan Kesehatan"]).trim()
                        : null,
                    adaPenyakitKronis: row["Ada Penyakit Kronis"]
                        ? String(row["Ada Penyakit Kronis"]).toLowerCase() ===
                          "ya"
                        : null,
                    detailPenyakitKronis: row["Detail Penyakit Kronis"]
                        ? String(row["Detail Penyakit Kronis"]).trim()
                        : null,

                    // Section 9: Disabilitas
                    penyandangDisabilitas: row["Penyandang Disabilitas"]
                        ? String(
                              row["Penyandang Disabilitas"],
                          ).toLowerCase() === "ya"
                        : null,
                    jenisDisabilitas: row[
                        "Jenis Disabilitas (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Jenis Disabilitas (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),

                    // Section 10: Diskriminasi & Kekerasan
                    pernahDiskriminasi: row["Pernah Diskriminasi"]
                        ? String(row["Pernah Diskriminasi"]).trim()
                        : null,
                    jenisDiskriminasi: row[
                        "Jenis Diskriminasi (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Jenis Diskriminasi (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    pelakuDiskriminasi: row[
                        "Pelaku Diskriminasi (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Pelaku Diskriminasi (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    lokasiKejadian: row[
                        "Lokasi Kejadian (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row["Lokasi Kejadian (pisahkan dengan koma)"],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    diskriminasiDilaporkan: row["Diskriminasi Dilaporkan"]
                        ? String(
                              row["Diskriminasi Dilaporkan"],
                          ).toLowerCase() === "ya"
                        : null,

                    // Section 11: Bantuan Sosial & Komunitas
                    menerimaBantuanSosial: row["Menerima Bantuan Sosial"]
                        ? String(
                              row["Menerima Bantuan Sosial"],
                          ).toLowerCase() === "ya"
                        : null,
                    terdaftarDTKS: row["Terdaftar DTKS"]
                        ? String(row["Terdaftar DTKS"]).toLowerCase() === "ya"
                        : null,
                    bantuanSosialLainnya: row[
                        "Bantuan Sosial Lainnya (pisahkan dengan koma)"
                    ]
                        ? JSON.stringify(
                              String(
                                  row[
                                      "Bantuan Sosial Lainnya (pisahkan dengan koma)"
                                  ],
                              )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                          )
                        : JSON.stringify([]),
                    kelompokKomunitas: row["Kelompok Komunitas"]
                        ? String(row["Kelompok Komunitas"]).trim()
                        : null,

                    // Status: auto-verified for admin-created bulk uploads
                    status: "verified",
                    verifiedBy: adminId,
                    verifiedAt: new Date(),
                };

                // Insert ke database
                await db.insert(formSubmission).values(submissionData);
                results.successCount++;
            } catch (error) {
                results.errorCount++;
                results.errors.push({
                    row: rowIndex,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                });
            }
        }

        // Data yang sukses di upload
        const success = results.errorCount === 0;

        return NextResponse.json(
            {
                success,
                successCount: results.successCount,
                errorCount: results.errorCount,
                errors: results.errors,
                message: success
                    ? `Berhasil menambahkan ${results.successCount} pengajuan`
                    : `${results.successCount} berhasil, ${results.errorCount} gagal`,
            },
            { status: success ? 201 : 207 }, // 207 = Multi-Status
        );
    } catch (error) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            {
                error: "Terjadi kesalahan saat memproses file",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
