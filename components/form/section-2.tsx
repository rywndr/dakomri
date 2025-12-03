"use client";

import type { CommunityFormApi, StatusKepemilikanEKTP } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { section2Schema } from "@/lib/validations/form-validation";

/**
 * Section 2: Dokumen Kependudukan
 * Fields: NIK, Nomor KK, Status Kepemilikan E-KTP
 */
interface Section2Props {
    form: CommunityFormApi;
}

export function Section2({ form }: Section2Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-1">
                    Section 2: Dokumen Kependudukan
                </h2>
                <p className="text-sm text-muted-foreground">
                    Informasi dokumen identitas dan kependudukan
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NIK */}
                <form.Field
                    name="nik"
                    validators={{
                        onChange: ({ value }) => {
                            const result =
                                section2Schema.shape.nik.safeParse(value);
                            return result.success
                                ? undefined
                                : result.error.errors[0]?.message;
                        },
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="nik">
                                NIK (Nomor Induk Kependudukan){" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nik"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="Masukkan 16 digit NIK"
                                maxLength={16}
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
                                Harus 16 digit angka
                            </p>
                        </div>
                    )}
                </form.Field>

                {/* Nomor KK */}
                <form.Field
                    name="nomorKK"
                    validators={{
                        onChange: ({ value }) => {
                            const result =
                                section2Schema.shape.nomorKK.safeParse(value);
                            return result.success
                                ? undefined
                                : result.error.errors[0]?.message;
                        },
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="nomorKK">
                                Nomor Kartu Keluarga
                            </Label>
                            <Input
                                id="nomorKK"
                                value={field.state.value || ""}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="Masukkan 16 digit Nomor KK"
                                maxLength={16}
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
                                Opsional - Jika diisi harus 16 digit angka
                            </p>
                        </div>
                    )}
                </form.Field>

                {/* Status Kepemilikan E-KTP */}
                <form.Field
                    name="statusKepemilikanEKTP"
                    validators={{
                        onChange: ({ value }) => {
                            const result =
                                section2Schema.shape.statusKepemilikanEKTP.safeParse(
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
                            <Label htmlFor="statusKepemilikanEKTP">
                                Status Kepemilikan E-KTP{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={field.state.value || ""}
                                onValueChange={(value) =>
                                    field.handleChange(
                                        value as StatusKepemilikanEKTP,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="statusKepemilikanEKTP"
                                    className={
                                        field.state.meta.errors.length > 0
                                            ? "border-destructive"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Pilih status kepemilikan E-KTP" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Memiliki">
                                        Memiliki
                                    </SelectItem>
                                    <SelectItem value="Tidak Memiliki">
                                        Tidak Memiliki
                                    </SelectItem>
                                    <SelectItem value="Dalam Proses">
                                        Dalam Proses
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
            </div>
        </div>
    );
}
