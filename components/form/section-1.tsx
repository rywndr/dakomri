"use client";

import type { CommunityFormApi } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Section 1: Data Pribadi
 * Fields: nama depan, nama belakang, alias, tempat lahir, tanggal lahir, usia, jenis kelamin, identitas gender
 */

interface Section1Props {
    form: CommunityFormApi;
}

export function Section1({ form }: Section1Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 1: Data Pribadi
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi identitas dasar responden
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Depan */}
                <form.Field
                    name="namaDepan"
                    validators={{
                        onChange: ({ value }: { value: string }) =>
                            !value ? "Nama depan wajib diisi" : undefined,
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="namaDepan">
                                Nama Depan{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="namaDepan"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="Masukkan nama depan"
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

                {/* Nama Belakang */}
                <form.Field name="namaBelakang">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="namaBelakang">Nama Belakang</Label>
                            <Input
                                id="namaBelakang"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                placeholder="Masukkan nama belakang"
                            />
                        </div>
                    )}
                </form.Field>

                {/* Nama Alias */}
                <form.Field name="namaAlias">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="namaAlias">
                                Nama Alias/Panggilan Komunitas
                            </Label>
                            <Input
                                id="namaAlias"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                placeholder="Masukkan nama alias"
                            />
                        </div>
                    )}
                </form.Field>

                {/* Tempat Lahir */}
                <form.Field name="tempatLahir">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                            <Input
                                id="tempatLahir"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                placeholder="Masukkan tempat lahir"
                            />
                        </div>
                    )}
                </form.Field>

                {/* Tanggal Lahir */}
                <form.Field name="tanggalLahir">
                    {(field) => {
                        const handleDateChange = (dateString: string) => {
                            if (dateString) {
                                const date = new Date(dateString);
                                field.handleChange(date);
                                // Hitung usia otomatis
                                const today = new Date();
                                const age =
                                    today.getFullYear() - date.getFullYear();
                                const monthDiff =
                                    today.getMonth() - date.getMonth();
                                const adjustedAge =
                                    monthDiff < 0 ||
                                    (monthDiff === 0 &&
                                        today.getDate() < date.getDate())
                                        ? age - 1
                                        : age;
                                form.setFieldValue("usia", adjustedAge);
                            }
                        };

                        // Format date untuk input type="date"
                        const dateValue = field.state.value
                            ? new Date(field.state.value)
                                  .toISOString()
                                  .split("T")[0]
                            : "";

                        return (
                            <div className="space-y-2">
                                <Label htmlFor="tanggalLahir">
                                    Tanggal Lahir
                                </Label>
                                <Input
                                    id="tanggalLahir"
                                    type="date"
                                    value={dateValue}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                    max={new Date().toISOString().split("T")[0]}
                                    min="1900-01-01"
                                />
                            </div>
                        );
                    }}
                </form.Field>

                {/* Usia */}
                <form.Field name="usia">
                    {(field) => {
                        const handleAgeChange = (age: number) => {
                            field.handleChange(age);
                            // Estimasi tanggal lahir jika belum diisi
                            const currentDate =
                                form.getFieldValue("tanggalLahir");
                            if (!currentDate && age > 0 && age < 150) {
                                const today = new Date();
                                const birthYear = today.getFullYear() - age;
                                const estimatedDate = new Date(
                                    birthYear,
                                    today.getMonth(),
                                    today.getDate(),
                                );
                                form.setFieldValue(
                                    "tanggalLahir",
                                    estimatedDate,
                                );
                            }
                        };

                        return (
                            <div className="space-y-2">
                                <Label htmlFor="usia">Usia (Tahun)</Label>
                                <Input
                                    id="usia"
                                    type="number"
                                    value={field.state.value || ""}
                                    onChange={(e) =>
                                        handleAgeChange(
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    placeholder="Masukkan usia"
                                    min={0}
                                    max={150}
                                />
                            </div>
                        );
                    }}
                </form.Field>

                {/* Jenis Kelamin */}
                <form.Field name="jenisKelamin">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                            <Select
                                value={field.state.value || ""}
                                onValueChange={(value) =>
                                    field.handleChange(
                                        value as "pria" | "wanita",
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pria">Pria</SelectItem>
                                    <SelectItem value="wanita">
                                        Wanita
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.Field>

                {/* Identitas Gender */}
                <form.Field name="identitasGender">
                    {(field) => {
                        const isCustom =
                            field.state.value !== "None" &&
                            field.state.value !== "Waria";
                        const selectValue = isCustom
                            ? "custom"
                            : field.state.value || "";

                        return (
                            <div className="space-y-2">
                                <Label htmlFor="identitasGender">
                                    Identitas Gender
                                </Label>
                                <Select
                                    value={selectValue}
                                    onValueChange={(value) => {
                                        if (value === "custom") {
                                            field.handleChange("");
                                        } else {
                                            field.handleChange(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih identitas gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">
                                            None
                                        </SelectItem>
                                        <SelectItem value="Waria">
                                            Waria
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            Lainnya (isi manual)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {isCustom && (
                                    <Input
                                        value={field.state.value || ""}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        placeholder="Masukkan identitas gender"
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        );
                    }}
                </form.Field>
            </div>
        </div>
    );
}
