import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    numeric,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * Schema untuk data formulir
 * Link ke user bersifat opsional (admin bisa input manual)
 */
export const formSubmission = pgTable("form_submission", {
    id: text("id").primaryKey(),

    // Optional link ke user yang submit
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),

    // Section 1: Data Pribadi
    namaDepan: text("nama_depan").notNull(),
    namaBelakang: text("nama_belakang"),
    namaAlias: text("nama_alias"),
    tempatLahir: text("tempat_lahir"),
    tanggalLahir: timestamp("tanggal_lahir"),
    usia: integer("usia"),
    jenisKelamin: text("jenis_kelamin"), // "pria" | "wanita"
    identitasGender: text("identitas_gender"), // "None" | "Waria" | custom text

    // Section 2: Dokumen Kependudukan
    nik: text("nik").notNull(),
    nomorKK: text("nomor_kk").notNull(),
    statusKepemilikanEKTP: text("status_kepemilikan_ektp").notNull(), // "Memiliki" | "Tidak Memiliki" | "Dalam Proses"

    // Section 3: Alamat
    alamatLengkap: text("alamat_lengkap").notNull(),
    kelurahan: text("kelurahan"),
    kecamatan: text("kecamatan"),
    kabupaten: text("kabupaten"),
    kota: text("kota").notNull(),
    statusKependudukan: text("status_kependudukan"), // "Pendatang" | "Penduduk Tetap"
    statusTempatTinggal: text("status_tempat_tinggal"), // "Bersama orang tua" | "Rumah pribadi" | "Sewa/kontrak"

    // Section 4: Kontak
    kontakTelp: text("kontak_telp").notNull(),

    // Section 5: Pekerjaan & Ekonomi
    statusPerkawinan: text("status_perkawinan"), // "Belum Kawin" | "Kawin" | "Cerai"
    pendidikanTerakhir: text("pendidikan_terakhir"), // "SD" | "SMP" | "SMA/SMK" | "Perguruan Tinggi" | "Tidak Sekolah"
    statusPekerjaan: text("status_pekerjaan"), // "Bekerja" | "Tidak Bekerja" | "Pelajar Mahasiswa"
    jenisPekerjaan: text("jenis_pekerjaan"),
    pendapatanBulanan: numeric("pendapatan_bulanan", {
        precision: 15,
        scale: 2,
    }),
    memilikiUsaha: boolean("memiliki_usaha"),
    detailUsaha: text("detail_usaha"),

    // Section 6: Pelatihan (stored as JSON arrays)
    pernahPelatihanKeterampilan: boolean("pernah_pelatihan_keterampilan"),
    jenisPelatihanDiikuti: text("jenis_pelatihan_diikuti"), // JSON array of strings
    penyelenggaraPelatihan: text("penyelenggara_pelatihan"), // JSON array of strings
    pelatihanDiinginkan: text("pelatihan_diinginkan"), // JSON array of strings

    // Section 7: Jaminan Sosial
    jenisJaminanSosial: text("jenis_jaminan_sosial"), // "Tidak memiliki jaminan sosial" | "BPJS kesehatan" | "BPJS-TK" | custom
    nomorIdentitasJaminan: text("nomor_identitas_jaminan"),

    // Section 8: Kesehatan
    aksesLayananKesehatan: text("akses_layanan_kesehatan"), // "Puskesmas" | "Rumah Sakit" | "Klinik" | "Tidak Pernah"
    adaPenyakitKronis: boolean("ada_penyakit_kronis"),
    detailPenyakitKronis: text("detail_penyakit_kronis"),

    // Section 9: Disabilitas
    penyandangDisabilitas: boolean("penyandang_disabilitas"),
    jenisDisabilitas: text("jenis_disabilitas"), // JSON array of strings

    // Section 10: Diskriminasi & Kekerasan
    pernahDiskriminasi: text("pernah_diskriminasi"), // "Tidak pernah" | "Pernah mengalami"
    jenisDiskriminasi: text("jenis_diskriminasi"), // JSON array: "Fisik" | "Ekonomi" | "Verbal" | "Seksual" | "Psikologi" | "Sosial"
    pelakuDiskriminasi: text("pelaku_diskriminasi"), // JSON array of strings
    lokasiKejadian: text("lokasi_kejadian"), // JSON array of strings
    diskriminasiDilaporkan: boolean("diskriminasi_dilaporkan"),

    // Section 11: Bantuan Sosial & Komunitas
    menerimaBantuanSosial: boolean("menerima_bantuan_sosial"),
    terdaftarDTKS: boolean("terdaftar_dtks"),
    bantuanSosialLainnya: text("bantuan_sosial_lainnya"), // JSON array of strings
    kelompokKomunitas: text("kelompok_komunitas"),

    // Metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    createdBy: text("created_by"), // ID admin yang input (jika diisi admin)
    status: text("status").default("draft").notNull(), // "draft" | "submitted" | "verified" | "rejected"

    // Verification fields
    verifiedBy: text("verified_by"), // ID admin yang verify
    verifiedAt: timestamp("verified_at"), // Waktu verification
    rejectionReason: text("rejection_reason"), // Alasan jika ditolak
    adminNotes: text("admin_notes"), // Catatan dari admin
});

export type FormSubmission = typeof formSubmission.$inferSelect;
export type NewFormSubmission = typeof formSubmission.$inferInsert;
