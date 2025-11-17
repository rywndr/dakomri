/**
 * Types untuk form submission
 * Gunakan untuk type safety di seluruh aplikasi
 */

export type JenisKelamin = "pria" | "wanita";

export type IdentitasGender = "None" | "Waria" | string;

export type StatusKepemilikanEKTP = "Memiliki" | "Tidak Memiliki" | "Dalam Proses";

export type StatusKependudukan = "Pendatang" | "Penduduk Tetap";

export type StatusTempatTinggal = "Bersama orang tua" | "Rumah pribadi" | "Sewa/kontrak";

export type StatusPerkawinan = "Belum Kawin" | "Kawin" | "Cerai";

export type PendidikanTerakhir = "SD" | "SMP" | "SMA/SMK" | "Perguruan Tinggi" | "Tidak Sekolah";

export type StatusPekerjaan = "Bekerja" | "Tidak Bekerja" | "Pelajar Mahasiswa";

export type JenisJaminanSosial =
  | "Tidak memiliki jaminan sosial"
  | "BPJS kesehatan"
  | "BPJS-TK"
  | "Lainnya";

export type AksesLayananKesehatan = "Puskesmas" | "Rumah Sakit" | "Klinik" | "Tidak Pernah";

export type PernahDiskriminasi = "Tidak pernah" | "Pernah mengalami";

export type JenisDiskriminasi = "Fisik" | "Ekonomi" | "Verbal" | "Seksual" | "Psikologi" | "Sosial";

export type PelakuDiskriminasi = "Keluarga" | "Kerabat" | "Pelanggan" | "Lainnya";

export type FormStatus = "draft" | "submitted" | "verified";

/**
 * Interface untuk data Section 1: Data Pribadi
 */
export interface Section1Data {
  namaDepan: string;
  namaBelakang?: string;
  namaAlias?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  usia?: number;
  jenisKelamin?: JenisKelamin;
  identitasGender?: string;
}

/**
 * Interface untuk data Section 2: Dokumen Kependudukan
 */
export interface Section2Data {
  nik: string;
  nomorKK: string;
  statusKepemilikanEKTP: StatusKepemilikanEKTP;
}

/**
 * Interface untuk data Section 3: Alamat
 */
export interface Section3Data {
  alamatLengkap: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupaten?: string;
  kota: string;
  statusKependudukan?: StatusKependudukan;
  statusTempatTinggal?: StatusTempatTinggal;
}

/**
 * Interface untuk data Section 4: Kontak
 */
export interface Section4Data {
  kontakTelp: string;
}

/**
 * Interface untuk data Section 5: Pekerjaan & Ekonomi
 */
export interface Section5Data {
  statusPerkawinan?: StatusPerkawinan;
  pendidikanTerakhir?: PendidikanTerakhir;
  statusPekerjaan?: StatusPekerjaan;
  jenisPekerjaan?: string;
  pendapatanBulanan?: number;
  memilikiUsaha?: boolean;
  detailUsaha?: string;
}

/**
 * Interface untuk data Section 6: Pelatihan
 */
export interface Section6Data {
  pernahPelatihanKeterampilan?: boolean;
  jenisPelatihanDiikuti?: string[];
  penyelenggaraPelatihan?: string[];
  pelatihanDiinginkan?: string[];
}

/**
 * Interface untuk data Section 7: Jaminan Sosial
 */
export interface Section7Data {
  jenisJaminanSosial?: string;
  nomorIdentitasJaminan?: string;
}

/**
 * Interface untuk data Section 8: Kesehatan
 */
export interface Section8Data {
  aksesLayananKesehatan?: AksesLayananKesehatan;
  adaPenyakitKronis?: boolean;
  detailPenyakitKronis?: string;
}

/**
 * Interface untuk data Section 9: Disabilitas
 */
export interface Section9Data {
  penyandangDisabilitas?: boolean;
  jenisDisabilitas?: string[];
}

/**
 * Interface untuk data Section 10: Diskriminasi & Kekerasan
 */
export interface Section10Data {
  pernahDiskriminasi?: PernahDiskriminasi;
  jenisDiskriminasi?: JenisDiskriminasi[];
  pelakuDiskriminasi?: string[];
  lokasiKejadian?: string[];
  diskriminasiDilaporkan?: boolean;
}

/**
 * Interface untuk data Section 11: Bantuan Sosial & Komunitas
 */
export interface Section11Data {
  menerimaBantuanSosial?: boolean;
  terdaftarDTKS?: boolean;
  bantuanSosialLainnya?: string[];
  kelompokKomunitas?: string;
}

/**
 * Interface lengkap untuk form submission
 */
export interface FormData
  extends Section1Data,
    Section2Data,
    Section3Data,
    Section4Data,
    Section5Data,
    Section6Data,
    Section7Data,
    Section8Data,
    Section9Data,
    Section10Data,
    Section11Data {}
