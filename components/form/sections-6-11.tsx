"use client";

import type {
    CommunityFormApi,
    AksesLayananKesehatan,
    JenisDiskriminasi,
    PernahDiskriminasi,
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
import { MultiInput } from "./multi-input";

/**
 * Section 6: Pelatihan
 * Fields: Pernah pelatihan, jenis pelatihan, penyelenggara, pelatihan yang diinginkan
 */
interface Section6Props {
    form: CommunityFormApi;
}

export function Section6({ form }: Section6Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 6: Pelatihan
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi pelatihan keterampilan usaha
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    pernahPelatihan: state.values.pernahPelatihanKeterampilan,
                })}
            >
                {({ pernahPelatihan }) => {
                    const isPelatihanFieldsEnabled = pernahPelatihan === true;

                    return (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Pernah Menerima Pelatihan */}
                            <form.Field name="pernahPelatihanKeterampilan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label>
                                            Pernah Menerima Pelatihan
                                            Keterampilan Usaha?
                                        </Label>
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
                                                <span>Pernah</span>
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

                            {/* Jenis Pelatihan yang Pernah Diikuti */}
                            <form.Field name="jenisPelatihanDiikuti">
                                {(field) => (
                                    <MultiInput
                                        label="Jenis Pelatihan yang Pernah Diikuti"
                                        values={field.state.value || []}
                                        onChange={(values) =>
                                            field.handleChange(values)
                                        }
                                        placeholder="Masukkan jenis pelatihan"
                                        disabled={!isPelatihanFieldsEnabled}
                                    />
                                )}
                            </form.Field>

                            {/* Penyelenggara Pelatihan */}
                            <form.Field name="penyelenggaraPelatihan">
                                {(field) => (
                                    <MultiInput
                                        label="Penyelenggara Pelatihan"
                                        values={field.state.value || []}
                                        onChange={(values) =>
                                            field.handleChange(values)
                                        }
                                        placeholder="Masukkan penyelenggara pelatihan"
                                        disabled={!isPelatihanFieldsEnabled}
                                    />
                                )}
                            </form.Field>

                            {/* Pelatihan yang Diinginkan */}
                            <form.Field name="pelatihanDiinginkan">
                                {(field) => (
                                    <MultiInput
                                        label="Pelatihan yang Diinginkan"
                                        values={field.state.value || []}
                                        onChange={(values) =>
                                            field.handleChange(values)
                                        }
                                        placeholder="Masukkan pelatihan yang diinginkan"
                                    />
                                )}
                            </form.Field>
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );
}

/**
 * Section 7: Jaminan Sosial
 * Fields: Jenis jaminan sosial, nomor identitas jaminan
 */
interface Section7Props {
    form: CommunityFormApi;
}

export function Section7({ form }: Section7Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 7: Jaminan Sosial
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi jaminan sosial dan kesehatan
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    jenisJaminan: state.values.jenisJaminanSosial,
                })}
            >
                {({ jenisJaminan }) => {
                    const isCustomJaminan = jenisJaminan === "Lainnya";

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Jenis Jaminan Sosial */}
                            <form.Field name="jenisJaminanSosial">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="jenisJaminanSosial">
                                            Jenis Jaminan Sosial
                                        </Label>
                                        <Select
                                            value={
                                                field.state.value ===
                                                    "Tidak memiliki jaminan sosial" ||
                                                field.state.value ===
                                                    "BPJS kesehatan" ||
                                                field.state.value === "BPJS-TK"
                                                    ? field.state.value
                                                    : field.state.value
                                                      ? "Lainnya"
                                                      : ""
                                            }
                                            onValueChange={(value) => {
                                                if (value === "Lainnya") {
                                                    field.handleChange("");
                                                } else {
                                                    field.handleChange(value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis jaminan sosial" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tidak memiliki jaminan sosial">
                                                    Tidak memiliki jaminan
                                                    sosial
                                                </SelectItem>
                                                <SelectItem value="BPJS kesehatan">
                                                    BPJS kesehatan
                                                </SelectItem>
                                                <SelectItem value="BPJS-TK">
                                                    BPJS-TK
                                                </SelectItem>
                                                <SelectItem value="Lainnya">
                                                    Lainnya (isi manual)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isCustomJaminan && (
                                            <Input
                                                value={field.state.value || ""}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan jenis jaminan sosial"
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            {/* Nomor Identitas Jaminan Sosial */}
                            <form.Field name="nomorIdentitasJaminan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="nomorIdentitasJaminan">
                                            Nomor Identitas Jaminan Sosial
                                        </Label>
                                        <Input
                                            id="nomorIdentitasJaminan"
                                            value={field.state.value || ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nomor identitas jaminan"
                                        />
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

/**
 * Section 8: Kesehatan
 * Fields: Akses layanan kesehatan, penyakit kronis
 */
interface Section8Props {
    form: CommunityFormApi;
}

export function Section8({ form }: Section8Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 8: Kesehatan
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi akses layanan kesehatan
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    adaPenyakit: state.values.adaPenyakitKronis,
                })}
            >
                {({ adaPenyakit }) => {
                    const isPenyakitDetailEnabled = adaPenyakit === true;

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Akses Layanan Kesehatan Terakhir */}
                            <form.Field name="aksesLayananKesehatan">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="aksesLayananKesehatan">
                                            Akses Layanan Kesehatan Terakhir
                                        </Label>
                                        <Select
                                            value={field.state.value || ""}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    value as AksesLayananKesehatan,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih akses layanan kesehatan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Puskesmas">
                                                    Puskesmas
                                                </SelectItem>
                                                <SelectItem value="Rumah Sakit">
                                                    Rumah Sakit
                                                </SelectItem>
                                                <SelectItem value="Klinik">
                                                    Klinik
                                                </SelectItem>
                                                <SelectItem value="Tidak Pernah">
                                                    Tidak Pernah
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </form.Field>

                            {/* Penyakit Kronis atau Kondisi Kesehatan Khusus */}
                            <form.Field name="adaPenyakitKronis">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label>
                                            Penyakit Kronis atau Kondisi
                                            Kesehatan Khusus
                                        </Label>
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
                                                <span>Ada</span>
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

                            {/* Detail Penyakit Kronis */}
                            {isPenyakitDetailEnabled && (
                                <form.Field name="detailPenyakitKronis">
                                    {(field) => (
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="detailPenyakitKronis">
                                                Detail Penyakit/Kondisi
                                                Kesehatan
                                            </Label>
                                            <Input
                                                id="detailPenyakitKronis"
                                                value={field.state.value || ""}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Jelaskan penyakit atau kondisi kesehatan"
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            )}
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );
}

/**
 * Section 9: Disabilitas
 * Fields: Penyandang disabilitas, jenis disabilitas
 */
interface Section9Props {
    form: CommunityFormApi;
}

export function Section9({ form }: Section9Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 9: Disabilitas
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi kondisi disabilitas
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    penyandangDisabilitas: state.values.penyandangDisabilitas,
                })}
            >
                {({ penyandangDisabilitas }) => {
                    const isDisabilitasDetailEnabled =
                        penyandangDisabilitas === true;

                    return (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Apakah Anda Penyandang Disabilitas */}
                            <form.Field name="penyandangDisabilitas">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label>
                                            Apakah Anda Penyandang Disabilitas?
                                        </Label>
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
                                                <span>Ya</span>
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

                            {/* Jenis Disabilitas */}
                            {isDisabilitasDetailEnabled && (
                                <form.Field name="jenisDisabilitas">
                                    {(field) => (
                                        <MultiInput
                                            label="Jenis Disabilitas"
                                            values={field.state.value || []}
                                            onChange={(values) =>
                                                field.handleChange(values)
                                            }
                                            placeholder="Masukkan jenis disabilitas"
                                        />
                                    )}
                                </form.Field>
                            )}
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );
}

/**
 * Section 10: Diskriminasi & Kekerasan
 * Fields: Pernah diskriminasi, jenis, pelaku, lokasi, dilaporkan
 */
interface Section10Props {
    form: CommunityFormApi;
}

export function Section10({ form }: Section10Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 10: Diskriminasi & Kekerasan
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi pengalaman diskriminasi atau kekerasan
                </p>
            </div>

            <form.Subscribe
                selector={(state) => ({
                    pernahDiskriminasi: state.values.pernahDiskriminasi,
                })}
            >
                {({ pernahDiskriminasi }) => {
                    const isDiskriminasiFieldsEnabled =
                        pernahDiskriminasi === "Pernah mengalami";
                    const jenisOptions: JenisDiskriminasi[] = [
                        "Fisik",
                        "Ekonomi",
                        "Verbal",
                        "Seksual",
                        "Psikologi",
                        "Sosial",
                    ];

                    return (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Pernah Mengalami Diskriminasi atau Kekerasan */}
                            <form.Field name="pernahDiskriminasi">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="pernahDiskriminasi">
                                            Pernah Mengalami Diskriminasi atau
                                            Kekerasan?
                                        </Label>
                                        <Select
                                            value={field.state.value || ""}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    value as PernahDiskriminasi,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tidak pernah">
                                                    Tidak pernah
                                                </SelectItem>
                                                <SelectItem value="Pernah mengalami">
                                                    Pernah mengalami
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </form.Field>

                            {/* Jenis Diskriminasi */}
                            {isDiskriminasiFieldsEnabled && (
                                <>
                                    <form.Field name="jenisDiskriminasi">
                                        {(field) => (
                                            <div className="space-y-2">
                                                <Label>
                                                    Jenis Diskriminasi
                                                </Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {jenisOptions.map(
                                                        (jenis) => (
                                                            <label
                                                                key={jenis}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        field.state.value?.includes(
                                                                            jenis,
                                                                        ) ??
                                                                        false
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const current =
                                                                            field
                                                                                .state
                                                                                .value ??
                                                                            [];
                                                                        if (
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        ) {
                                                                            field.handleChange(
                                                                                [
                                                                                    ...current,
                                                                                    jenis,
                                                                                ],
                                                                            );
                                                                        } else {
                                                                            field.handleChange(
                                                                                current.filter(
                                                                                    (
                                                                                        value,
                                                                                    ) =>
                                                                                        value !==
                                                                                        jenis,
                                                                                ),
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="text-sm">
                                                                    {jenis}
                                                                </span>
                                                            </label>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </form.Field>

                                    {/* Pelaku Diskriminasi/Kekerasan */}
                                    <form.Field name="pelakuDiskriminasi">
                                        {(field) => (
                                            <MultiInput
                                                label="Pelaku Diskriminasi/Kekerasan"
                                                values={field.state.value || []}
                                                onChange={(values) =>
                                                    field.handleChange(values)
                                                }
                                                placeholder="Contoh: Keluarga, Kerabat, Pelanggan, dll"
                                            />
                                        )}
                                    </form.Field>

                                    {/* Lokasi Kejadian */}
                                    <form.Field name="lokasiKejadian">
                                        {(field) => (
                                            <MultiInput
                                                label="Lokasi Kejadian"
                                                values={field.state.value || []}
                                                onChange={(values) =>
                                                    field.handleChange(values)
                                                }
                                                placeholder="Masukkan lokasi kejadian"
                                            />
                                        )}
                                    </form.Field>

                                    {/* Apakah Diskriminasi/Kekerasan Telah Dilaporkan */}
                                    <form.Field name="diskriminasiDilaporkan">
                                        {(field) => (
                                            <div className="space-y-2">
                                                <Label>
                                                    Apakah
                                                    Diskriminasi/Kekerasan Telah
                                                    Dilaporkan?
                                                </Label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={
                                                                field.state
                                                                    .value ===
                                                                true
                                                            }
                                                            onChange={() =>
                                                                field.handleChange(
                                                                    true,
                                                                )
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                        <span>Sudah</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={
                                                                field.state
                                                                    .value ===
                                                                false
                                                            }
                                                            onChange={() =>
                                                                field.handleChange(
                                                                    false,
                                                                )
                                                            }
                                                            className="h-4 w-4"
                                                        />
                                                        <span>Belum</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </form.Field>
                                </>
                            )}
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );
}

/**
 * Section 11: Bantuan Sosial & Komunitas
 * Fields: Bantuan sosial, DTKS, bantuan lainnya, komunitas
 */
interface Section11Props {
    form: CommunityFormApi;
}

export function Section11({ form }: Section11Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 11: Bantuan Sosial & Komunitas
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi bantuan sosial dan keterlibatan komunitas
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mendapatkan Bantuan Sosial dari Pemerintah */}
                <form.Field name="menerimaBantuanSosial">
                    {(field) => (
                        <div className="space-y-2">
                            <Label>
                                Mendapatkan Bantuan Sosial dari Pemerintah?
                            </Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={field.state.value === true}
                                        onChange={() =>
                                            field.handleChange(true)
                                        }
                                        className="h-4 w-4"
                                    />
                                    <span>Menerima</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={field.state.value === false}
                                        onChange={() =>
                                            field.handleChange(false)
                                        }
                                        className="h-4 w-4"
                                    />
                                    <span>Tidak</span>
                                </label>
                            </div>
                        </div>
                    )}
                </form.Field>

                {/* Terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS) */}
                <form.Field name="terdaftarDTKS">
                    {(field) => (
                        <div className="space-y-2">
                            <Label>
                                Terdaftar dalam Data Terpadu Kesejahteraan
                                Sosial (DTKS)?
                            </Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={field.state.value === true}
                                        onChange={() =>
                                            field.handleChange(true)
                                        }
                                        className="h-4 w-4"
                                    />
                                    <span>Ya</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={field.state.value === false}
                                        onChange={() =>
                                            field.handleChange(false)
                                        }
                                        className="h-4 w-4"
                                    />
                                    <span>Tidak</span>
                                </label>
                            </div>
                        </div>
                    )}
                </form.Field>

                {/* Bantuan Sosial Lainnya yang Diterima */}
                <form.Field name="bantuanSosialLainnya">
                    {(field) => (
                        <div className="md:col-span-2">
                            <MultiInput
                                label="Bantuan Sosial Lainnya yang Diterima (jika ada)"
                                values={field.state.value || []}
                                onChange={(values) =>
                                    field.handleChange(values)
                                }
                                placeholder="Masukkan bantuan sosial lainnya"
                            />
                        </div>
                    )}
                </form.Field>

                {/* Kelompok Komunitas yang Diikuti */}
                <form.Field name="kelompokKomunitas">
                    {(field) => (
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="kelompokKomunitas">
                                Kelompok Komunitas yang Diikuti
                            </Label>
                            <Input
                                id="kelompokKomunitas"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                placeholder="Masukkan kelompok komunitas"
                            />
                        </div>
                    )}
                </form.Field>
            </div>
        </div>
    );
}
