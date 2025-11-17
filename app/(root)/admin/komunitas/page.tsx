import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq, desc, asc, ilike, or, and, count } from "drizzle-orm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KomunitasActions } from "@/components/admin/komunitas-actions";
import { Users, Briefcase } from "lucide-react";

export default async function KomunitasPage() {
    // Get verified community members
    const members = await db
        .select({
            id: formSubmission.id,
            namaDepan: formSubmission.namaDepan,
            namaBelakang: formSubmission.namaBelakang,
            namaAlias: formSubmission.namaAlias,
            nik: formSubmission.nik,
            kota: formSubmission.kota,
            kelurahan: formSubmission.kelurahan,
            kecamatan: formSubmission.kecamatan,
            kontakTelp: formSubmission.kontakTelp,
            jenisKelamin: formSubmission.jenisKelamin,
            identitasGender: formSubmission.identitasGender,
            usia: formSubmission.usia,
            statusPekerjaan: formSubmission.statusPekerjaan,
            jenisPekerjaan: formSubmission.jenisPekerjaan,
            pendidikanTerakhir: formSubmission.pendidikanTerakhir,
            createdAt: formSubmission.createdAt,
            verifiedAt: formSubmission.verifiedAt,
            userId: formSubmission.userId,
            userName: user.name,
            userEmail: user.email,
        })
        .from(formSubmission)
        .leftJoin(user, eq(formSubmission.userId, user.id));

    // Total count
    const [totalResult] = await db
        .select({ count: count() })
        .from(formSubmission);

    const total = totalResult?.count || 0;

    // Statistik
    const [bekerjaCount] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(
            and(
                eq(formSubmission.status, "verified"),
                eq(formSubmission.statusPekerjaan, "Bekerja"),
            ),
        );

    const totalMembers = total;
    const bekerjaMembers = bekerjaCount?.count || 0;

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Komunitas
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola data anggota komunitas terverifikasi
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Anggota
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            Terverifikasi
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Bekerja
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {bekerjaMembers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Status pekerjaan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Anggota Komunitas*/}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Data Anggota Komunitas</CardTitle>
                            <CardDescription>
                                Daftar anggota yang telah diverifikasi
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {members.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                            <div className="text-center">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Pekerjaan</TableHead>
                                        <TableHead>Pendidikan</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => {
                                        const fullName = [
                                            member.namaDepan,
                                            member.namaBelakang,
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                        const location = [
                                            member.kelurahan,
                                            member.kecamatan,
                                            member.kota,
                                        ]
                                            .filter(Boolean)
                                            .join(", ");

                                        return (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>{fullName}</div>
                                                        {member.namaAlias && (
                                                            <div className="text-xs text-muted-foreground">
                                                                (
                                                                {
                                                                    member.namaAlias
                                                                }
                                                                )
                                                            </div>
                                                        )}
                                                        {member.usia && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {member.usia}{" "}
                                                                tahun
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                        {member.nik}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px] truncate">
                                                        {location ||
                                                            member.kota}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {member.kontakTelp}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="text-sm">
                                                            {member.jenisKelamin ||
                                                                "-"}
                                                        </div>
                                                        {member.identitasGender &&
                                                            member.identitasGender !==
                                                                "None" && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs mt-1"
                                                                >
                                                                    {
                                                                        member.identitasGender
                                                                    }
                                                                </Badge>
                                                            )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        {member.jenisPekerjaan ? (
                                                            <>
                                                                <div className="text-sm font-medium">
                                                                    {
                                                                        member.jenisPekerjaan
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {
                                                                        member.statusPekerjaan
                                                                    }
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                {member.statusPekerjaan ||
                                                                    "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {member.pendidikanTerakhir ||
                                                        "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <KomunitasActions
                                                        submissionId={member.id}
                                                        memberName={fullName}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
