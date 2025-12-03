"use client";

import type {
    CommunityFormApi,
    StatusKependudukan,
    StatusTempatTinggal,
    StatusPerkawinan,
    PendidikanTerakhir,
    StatusPekerjaan,
} from "@/types/form";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    section3Schema,
    section4Schema,
    section5Schema,
} from "@/lib/validations/form-validation";

/**
 * Section 3: Alamat
 * Fields: Alamat lengkap, Kelurahan, Kecamatan, Kabupaten, Kota, Status Kependudukan, Status Tempat Tinggal
 */
interface Section3Props {
    form: CommunityFormApi;
}

export function Section3({ form }: Section3Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 3: Alamat
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi tempat tinggal dan domisili
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Alamat Lengkap */}
                <form.Field
                    name="alamatLengkap"
                    validators={{
                        onChange: ({ value }: { value: string }) => {
                            const result =
                                section3Schema.shape.alamatLengkap.safeParse(
                                    value,
                                );
                            return result.success
                                ? undefined
                                : result.error.errors[0]?.message;
                        },
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="alamatLengkap">
                                Alamat Lengkap (Jalan, Nomor, RT/RW){" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="alamatLengkap"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="Masukkan alamat lengkap"
                                className={
                                    field.state.meta.errors.length > 0
                                        ? "border-destructive"
                                        : ""
                                }
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.errors[0]}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kelurahan */}
                    <form.Field name="kelurahan">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="kelurahan">
                                    Kelurahan Domisili
                                </Label>
                                <Input
                                    id="kelurahan"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="Masukkan kelurahan"
                                />
                            </div>
                        )}
                    </form.Field>

                    {/* Kecamatan */}
                    <form.Field name="kecamatan">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="kecamatan">
                                    Kecamatan Domisili
                                </Label>
                                <Input
                                    id="kecamatan"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="Masukkan kecamatan"
                                />
                            </div>
                        )}
                    </form.Field>

                    {/* Kabupaten */}
                    <form.Field name="kabupaten">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="kabupaten">
                                    Kabupaten Domisili
                                </Label>
                                <Input
                                    id="kabupaten"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="Masukkan kabupaten"
                                />
                            </div>
                        )}
                    </form.Field>

                    {/* Kota */}
                    <form.Field
                        name="kota"
                        validators={{
                            onChange: ({ value }: { value: string }) => {
                                const result =
                                    section3Schema.shape.kota.safeParse(value);
                                return result.success
                                    ? undefined
                                    : result.error.errors[0]?.message;
                            },
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="kota">
                                    Kota{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="kota"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    placeholder="Masukkan kota"
                                    className={
                                        field.state.meta.errors.length > 0
                                            ? "border-destructive"
                                            : ""
                                    }
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-destructive">
                                        {field.state.meta.errors[0]}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Status Kependudukan */}
                    <form.Field name="statusKependudukan">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="statusKependudukan">
                                    Status Kependudukan
                                </Label>
                                <Select
                                    value={field.state.value || ""}
                                    onValueChange={(value) =>
                                        field.handleChange(
                                            value as StatusKependudukan,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status kependudukan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendatang">
                                            Pendatang
                                        </SelectItem>
                                        <SelectItem value="Penduduk Tetap">
                                            Penduduk Tetap
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form.Field>

                    {/* Status Tempat Tinggal */}
                    <form.Field name="statusTempatTinggal">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="statusTempatTinggal">
                                    Status Tempat Tinggal
                                </Label>
                                <Select
                                    value={field.state.value || ""}
                                    onValueChange={(value) =>
                                        field.handleChange(
                                            value as StatusTempatTinggal,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status tempat tinggal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bersama orang tua">
                                            Bersama orang tua
                                        </SelectItem>
                                        <SelectItem value="Rumah pribadi">
                                            Rumah pribadi
                                        </SelectItem>
                                        <SelectItem value="Sewa/kontrak">
                                            Sewa/kontrak
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form.Field>
                </div>
            </div>
        </div>
    );
}

/**
 * Section 4: Kontak
 * Fields: Kontak yang bisa dihubungi
 */
interface Section4Props {
    form: CommunityFormApi;
}

export function Section4({ form }: Section4Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 4: Kontak
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi kontak yang dapat dihubungi
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kontak Telp */}
                <form.Field
                    name="kontakTelp"
                    validators={{
                        onChange: ({ value }: { value: string }) => {
                            const result =
                                section4Schema.shape.kontakTelp.safeParse(
                                    value,
                                );
                            return result.success
                                ? undefined
                                : result.error.errors[0]?.message;
                        },
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="kontakTelp">
                                Kontak yang bisa dihubungi{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="kontakTelp"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="+628123456789 atau 08123456789"
                                className={
                                    field.state.meta.errors.length > 0
                                        ? "border-destructive"
                                        : ""
                                }
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">
                                    {field.state.meta.errors[0]}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Format: +62 atau 08 diikuti 9-12 digit
                            </p>
                        </div>
                    )}
                </form.Field>
            </div>
        </div>
    );
}

/**
 * Section 5: Pekerjaan & Ekonomi
 * Fields: Status Perkawinan, Pendidikan, Status Pekerjaan, Jenis Pekerjaan, Pendapatan, Usaha
 */
interface Section5Props {
    form: CommunityFormApi;
}

export function Section5({ form }: Section5Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 5: Pekerjaan & Ekonomi
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi pekerjaan, pendidikan, dan ekonomi
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    statusPekerjaan: state.values.statusPekerjaan,
                    memilikiUsaha: state.values.memilikiUsaha,
                })}
            >
                {({ statusPekerjaan, memilikiUsaha }) => {
                    const isJenisPekerjaanEnabled =
                        statusPekerjaan === "Bekerja";
                    const isDetailUsahaEnabled = memilikiUsaha === true;

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Status Perkawinan */}
                            <form.Field
                                name="statusPerkawinan"
                                validators={{
                                    onChange: ({ value }) => {
                                        const result =
                                            section5Schema.shape.statusPerkawinan.safeParse(
                                                value,
                                            );
                                        return result.success
                                            ? undefined
                                            : result.error.errors[0]?.message;
                                    },
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="statusPerkawinan">
                                            Status Perkawinan{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={field.state.value || ""}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    value as StatusPerkawinan,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="statusPerkawinan"
                                                className={
                                                    field.state.meta.errors
                                                        .length > 0
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            >
                                                <SelectValue placeholder="Pilih status perkawinan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Belum Kawin">
                                                    Belum Kawin
                                                </SelectItem>
                                                <SelectItem value="Kawin">
                                                    Kawin
                                                </SelectItem>
                                                <SelectItem value="Cerai">
                                                    Cerai
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-sm text-destructive">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Pendidikan Terakhir */}
                            <form.Field
                                name="pendidikanTerakhir"
                                validators={{
                                    onChange: ({ value }) => {
                                        const result =
                                            section5Schema.shape.pendidikanTerakhir.safeParse(
                                                value,
                                            );
                                        return result.success
                                            ? undefined
                                            : result.error.errors[0]?.message;
                                    },
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="pendidikanTerakhir">
                                            Pendidikan Terakhir{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={field.state.value || ""}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    value as PendidikanTerakhir,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="pendidikanTerakhir"
                                                className={
                                                    field.state.meta.errors
                                                        .length > 0
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            >
                                                <SelectValue placeholder="Pilih pendidikan terakhir" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SD">
                                                    SD
                                                </SelectItem>
                                                <SelectItem value="SMP">
                                                    SMP
                                                </SelectItem>
                                                <SelectItem value="SMA/SMK">
                                                    SMA/SMK
                                                </SelectItem>
                                                <SelectItem value="Perguruan Tinggi">
                                                    Perguruan Tinggi
                                                </SelectItem>
                                                <SelectItem value="Tidak Sekolah">
                                                    Tidak Sekolah
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-sm text-destructive">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Status Pekerjaan */}
                            <form.Field name="statusPekerjaan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="statusPekerjaan">
                                            Status Pekerjaan
                                        </Label>
                                        <Select
                                            value={field.state.value || ""}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    value as StatusPekerjaan,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status pekerjaan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bekerja">
                                                    Bekerja
                                                </SelectItem>
                                                <SelectItem value="Tidak Bekerja">
                                                    Tidak Bekerja
                                                </SelectItem>
                                                <SelectItem value="Pelajar Mahasiswa">
                                                    Pelajar Mahasiswa
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </form.Field>

                            {/* Jenis Pekerjaan */}
                            <form.Field name="jenisPekerjaan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="jenisPekerjaan">
                                            Jenis Pekerjaan
                                        </Label>
                                        <Input
                                            id="jenisPekerjaan"
                                            value={field.state.value || ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan jenis pekerjaan"
                                            disabled={!isJenisPekerjaanEnabled}
                                        />
                                        {!isJenisPekerjaanEnabled && (
                                            <p className="text-xs text-muted-foreground">
                                                Hanya aktif jika status
                                                pekerjaan &apos;Bekerja&apos;
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Pendapatan Bulanan */}
                            <form.Field name="pendapatanBulanan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="pendapatanBulanan">
                                            Pendapatan Bulanan (Rp)
                                        </Label>
                                        <Input
                                            id="pendapatanBulanan"
                                            type="number"
                                            value={field.state.value || ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                            placeholder="Masukkan pendapatan bulanan"
                                            min={0}
                                        />
                                    </div>
                                )}
                            </form.Field>

                            {/* Memiliki Usaha Sendiri */}
                            <form.Field name="memilikiUsaha">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label>Memiliki Usaha Sendiri?</Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        field.state.value ===
                                                        true
                                                    }
                                                    onChange={() =>
                                                        field.handleChange(true)
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                <span>Punya</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        field.state.value ===
                                                        false
                                                    }
                                                    onChange={() =>
                                                        field.handleChange(
                                                            false,
                                                        )
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                <span>Tidak</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </form.Field>

                            {/* Detail Usaha */}
                            <form.Field name="detailUsaha">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="detailUsaha">
                                            Detail Usaha
                                        </Label>
                                        <Input
                                            id="detailUsaha"
                                            value={field.state.value || ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan detail usaha"
                                            disabled={!isDetailUsahaEnabled}
                                        />
                                        {!isDetailUsahaEnabled && (
                                            <p className="text-xs text-muted-foreground">
                                                Hanya aktif jika memiliki usaha
                                                sendiri
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );
}
