import { Suspense } from "react";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq, desc, and, count, ilike, or } from "drizzle-orm";
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
import { Skeleton } from "@/components/ui/skeleton";
import { KomunitasActions } from "@/components/admin/komunitas-actions";
import { KomunitasExportButton } from "@/components/admin/komunitas-export-button";
import { PaginationControls } from "@/components/ui/pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { KomunitasFilters } from "@/components/admin/komunitas-filters";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import { Users, Briefcase } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        employment?: string;
        discrimination?: string;
        socialAssistance?: string;
    }>;
}

function PageSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-32 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <Skeleton className="h-10 w-full sm:w-48" />
                        <Skeleton className="h-10 w-full sm:w-48" />
                        <Skeleton className="h-10 w-full sm:w-48" />
                    </div>
                    <div className="mt-4">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Server component untuk konten halaman komunitas
 * searchParams diakses di dalam komponen ini agar berada dalam Suspense boundary
 */
async function KomunitasPageContent({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        search?: string;
        employment?: string;
        discrimination?: string;
        socialAssistance?: string;
    }>;
}) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1", 10);
    const searchQuery = params.search || "";
    const employmentFilter = params.employment || "all";
    const discriminationFilter = params.discrimination || "all";
    const socialAssistanceFilter = params.socialAssistance || "all";
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    // Build where conditions
    const whereConditions = [eq(formSubmission.status, "verified")];

    // Add search conditions
    if (searchQuery) {
        whereConditions.push(
            or(
                ilike(formSubmission.namaDepan, `%${searchQuery}%`),
                ilike(formSubmission.namaBelakang, `%${searchQuery}%`),
                ilike(formSubmission.namaAlias, `%${searchQuery}%`),
                ilike(formSubmission.nik, `%${searchQuery}%`),
                ilike(formSubmission.kota, `%${searchQuery}%`),
            )!,
        );
    }

    // Employment status filter
    if (employmentFilter !== "all") {
        whereConditions.push(
            eq(formSubmission.statusPekerjaan, employmentFilter),
        );
    }

    // Discrimination filter
    if (discriminationFilter !== "all") {
        whereConditions.push(
            eq(formSubmission.pernahDiskriminasi, discriminationFilter),
        );
    }

    // Social Assistance filter
    if (socialAssistanceFilter !== "all") {
        const receivesAssistance = socialAssistanceFilter === "yes";
        whereConditions.push(
            eq(formSubmission.menerimaBantuanSosial, receivesAssistance),
        );
    }

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
        .leftJoin(user, eq(formSubmission.userId, user.id))
        .where(and(...whereConditions))
        .orderBy(desc(formSubmission.verifiedAt))
        .limit(limit)
        .offset(offset);

    // Total count
    const [totalResult] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(and(...whereConditions));

    const total = totalResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

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
                <KomunitasExportButton totalMembers={totalMembers} />
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
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <KomunitasFilters
                            currentEmployment={employmentFilter}
                            currentDiscrimination={discriminationFilter}
                            currentSocialAssistance={socialAssistanceFilter}
                        />
                    </div>
                    <div className="mt-4">
                        <AdminSearch
                            placeholder="Cari nama, NIK, atau lokasi..."
                            searchParam="search"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {members.length === 0 ? (
                        <Empty className="h-[400px]">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Users />
                                </EmptyMedia>
                                <EmptyTitle>
                                    Belum ada anggota komunitas
                                </EmptyTitle>
                                <EmptyDescription>
                                    Anggota yang telah diverifikasi akan muncul
                                    di sini
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
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

                            {totalPages > 1 && (
                                <div className="mt-4">
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Halaman Admin Komunitas dengan Suspense boundary
 * searchParams diakses di dalam Suspense untuk menghindari blocking route
 */
export default function KomunitasPage({ searchParams }: PageProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <KomunitasPageContent searchParams={searchParams} />
        </Suspense>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Kelola Komunitas | Admin DAKOMRI",
    description: "Halaman admin untuk mengelola komunitas",
};
