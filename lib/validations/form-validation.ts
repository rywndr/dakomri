import { z } from "zod";

/**
 * Validasi NIK Indonesia (16 digit)
 */
const nikSchema = z
    .string()
    .min(1, "NIK wajib diisi")
    .length(16, "NIK harus 16 digit")
    .regex(/^\d{16}$/, "NIK harus berisi angka");

/**
 * Validasi Nomor KK Indonesia (16 digit) - Optional
 */
const nomorKKSchema = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^\d{16}$/.test(val),
        "Nomor KK harus 16 digit angka",
    );

/**
 * Validasi nomor telepon Indonesia (+62)
 */
const phoneSchema = z
    .string()
    .min(1, "Nomor kontak wajib diisi")
    .regex(
        /^(\+62|62|0)[0-9]{9,12}$/,
        "Format nomor telepon tidak valid (contoh: +628123456789 atau 08123456789)",
    );

/**
 * Schema untuk Section 1: Data Pribadi
 * Mandatory: namaDepan
 */
export const section1Schema = z.object({
    namaDepan: z.string().min(1, "Nama depan wajib diisi"),
    namaBelakang: z.string().optional(),
    namaAlias: z.string().optional(),
    tempatLahir: z.string().optional(),
    tanggalLahir: z.coerce.date().optional(),
    usia: z.number().min(0).max(150).optional(),
    jenisKelamin: z.enum(["pria", "wanita"]).optional(),
    identitasGender: z.string().optional(),
});

/**
 * Schema untuk Section 2: Dokumen Kependudukan
 * Mandatory: nik, statusKepemilikanEKTP
 * Optional: nomorKK
 */
export const section2Schema = z.object({
    nik: nikSchema,
    nomorKK: nomorKKSchema,
    statusKepemilikanEKTP: z.enum(
        ["Memiliki", "Tidak Memiliki", "Dalam Proses"],
        { required_error: "Status kepemilikan E-KTP wajib diisi" },
    ),
});

/**
 * Schema untuk Section 3: Alamat
 * Mandatory: alamatLengkap, kota
 */
export const section3Schema = z.object({
    alamatLengkap: z.string().min(1, "Alamat lengkap wajib diisi"),
    kelurahan: z.string().optional(),
    kecamatan: z.string().optional(),
    kabupaten: z.string().optional(),
    kota: z.string().min(1, "Kota wajib diisi"),
    statusKependudukan: z.enum(["Pendatang", "Penduduk Tetap"]).optional(),
    statusTempatTinggal: z
        .enum(["Bersama orang tua", "Rumah pribadi", "Sewa/kontrak"])
        .optional(),
});

/**
 * Schema untuk Section 4: Kontak
 * Mandatory: kontakTelp
 */
export const section4Schema = z.object({
    kontakTelp: phoneSchema,
});

/**
 * Schema untuk Section 5: Pekerjaan & Ekonomi
 * Mandatory: statusPerkawinan, pendidikanTerakhir
 */
export const section5Schema = z.object({
    statusPerkawinan: z.enum(["Belum Kawin", "Kawin", "Cerai"], {
        required_error: "Status perkawinan wajib diisi",
    }),
    pendidikanTerakhir: z.enum(
        ["SD", "SMP", "SMA/SMK", "Perguruan Tinggi", "Tidak Sekolah"],
        { required_error: "Pendidikan terakhir wajib diisi" },
    ),
    statusPekerjaan: z
        .enum(["Bekerja", "Tidak Bekerja", "Pelajar Mahasiswa"])
        .optional(),
    jenisPekerjaan: z.string().optional(),
    pendapatanBulanan: z.number().min(0).optional(),
    memilikiUsaha: z.boolean().optional(),
    detailUsaha: z.string().optional(),
});

/**
 * Schema untuk Section 6: Pelatihan
 */
export const section6Schema = z.object({
    pernahPelatihanKeterampilan: z.boolean().optional(),
    jenisPelatihanDiikuti: z.array(z.string()).optional(),
    penyelenggaraPelatihan: z.array(z.string()).optional(),
    pelatihanDiinginkan: z.array(z.string()).optional(),
});

/**
 * Schema untuk Section 7: Jaminan Sosial
 */
export const section7Schema = z.object({
    jenisJaminanSosial: z.string().optional(),
    nomorIdentitasJaminan: z.string().optional(),
});

/**
 * Schema untuk Section 8: Kesehatan
 */
export const section8Schema = z.object({
    aksesLayananKesehatan: z
        .enum(["Puskesmas", "Rumah Sakit", "Klinik", "Tidak Pernah"])
        .optional(),
    adaPenyakitKronis: z.boolean().optional(),
    detailPenyakitKronis: z.string().optional(),
});

/**
 * Schema untuk Section 9: Disabilitas
 */
export const section9Schema = z.object({
    penyandangDisabilitas: z.boolean().optional(),
    jenisDisabilitas: z.array(z.string()).optional(),
});

/**
 * Schema untuk Section 10: Diskriminasi & Kekerasan
 */
export const section10Schema = z.object({
    pernahDiskriminasi: z.enum(["Tidak pernah", "Pernah mengalami"]).optional(),
    jenisDiskriminasi: z
        .array(
            z.enum([
                "Fisik",
                "Ekonomi",
                "Verbal",
                "Seksual",
                "Psikologi",
                "Sosial",
            ]),
        )
        .optional(),
    pelakuDiskriminasi: z.array(z.string()).optional(),
    lokasiKejadian: z.array(z.string()).optional(),
    diskriminasiDilaporkan: z.boolean().optional(),
});

/**
 * Schema untuk Section 11: Bantuan Sosial & Komunitas
 */
export const section11Schema = z.object({
    menerimaBantuanSosial: z.boolean().optional(),
    terdaftarDTKS: z.boolean().optional(),
    bantuanSosialLainnya: z.array(z.string()).optional(),
    kelompokKomunitas: z.string().optional(),
});

/**
 * Schema lengkap untuk form submission
 *
 * Mandatory fields (marked with * in UI):
 * 1. namaDepan - Nama Depan
 * 2. nik - NIK
 * 3. statusKepemilikanEKTP - Status Kepemilikan E-KTP
 * 4. alamatLengkap - Alamat Lengkap
 * 5. kota - Kota
 * 6. kontakTelp - Kontak yang bisa dihubungi
 * 7. statusPerkawinan - Status Perkawinan
 * 8. pendidikanTerakhir - Pendidikan Terakhir
 */
export const formSubmissionSchema = z.object({
    // Section 1
    ...section1Schema.shape,
    // Section 2
    ...section2Schema.shape,
    // Section 3
    ...section3Schema.shape,
    // Section 4
    ...section4Schema.shape,
    // Section 5
    ...section5Schema.shape,
    // Section 6
    ...section6Schema.shape,
    // Section 7
    ...section7Schema.shape,
    // Section 8
    ...section8Schema.shape,
    // Section 9
    ...section9Schema.shape,
    // Section 10
    ...section10Schema.shape,
    // Section 11
    ...section11Schema.shape,
});

export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;

/**
 * List of mandatory field names for reference in UI and validation
 */
export const MANDATORY_FIELDS = [
    "namaDepan",
    "nik",
    "statusKepemilikanEKTP",
    "alamatLengkap",
    "kota",
    "kontakTelp",
    "statusPerkawinan",
    "pendidikanTerakhir",
] as const;

export type MandatoryField = (typeof MANDATORY_FIELDS)[number];

/**
 * Helper function to check if a field is mandatory
 */
export function isMandatoryField(fieldName: string): boolean {
    return MANDATORY_FIELDS.includes(fieldName as MandatoryField);
}
