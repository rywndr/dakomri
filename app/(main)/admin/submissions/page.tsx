import { Suspense } from "react";
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
import { PaginationControls } from "@/components/admin/pagination-controls";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { SubmissionFilters } from "@/components/admin/submission-filters";
import { AdminSearch } from "@/components/admin/admin-search";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { getSubmissions, getSubmissionStats } from "./data";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: string;
        search?: string;
    }>;
}

function StatsCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
    );
}

function SubmissionsTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
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
    );
}

function PageContentSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <StatsCardsSkeleton />

            {/* Table Skeleton */}
            <SubmissionsTableSkeleton />
        </div>
    );
}

/**
 * Server component untuk stats cards dengan caching
 */
async function StatsCards() {
    const stats = await getSubmissionStats();

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Menunggu Verifikasi
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.pendingCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Perlu ditinjau
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Disetujui
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.approvedCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total diverifikasi
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ditolak
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.rejectedCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total ditolak
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Props untuk SubmissionsTable component
 */
interface SubmissionsTableProps {
    statusFilter: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    currentPage: number;
    searchQuery: string;
}

/**
 * Server component untuk submissions table dengan caching
 */
async function SubmissionsTable({
    statusFilter,
    sortBy,
    sortDirection,
    currentPage,
    searchQuery,
}: SubmissionsTableProps) {
    const limit = 10;

    const { submissions, totalPages } = await getSubmissions({
        statusFilter,
        sortBy,
        sortDirection,
        page: currentPage,
        limit,
        searchQuery,
    });

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case "submitted":
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        Menunggu
                    </Badge>
                );
            case "verified":
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                    >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disetujui
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                    >
                        <XCircle className="h-3 w-3 mr-1" />
                        Ditolak
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Draft
                    </Badge>
                );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Ajuan</CardTitle>
                <CardDescription>
                    Klik pada baris untuk melihat detail lengkap formulir
                </CardDescription>

                {/* Filters */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <SubmissionFilters
                        currentStatus={statusFilter}
                        currentSort={sortBy}
                        currentDirection={sortDirection}
                    />
                </div>

                {/* Search */}
                <div className="mt-4">
                    <AdminSearch
                        placeholder="Cari berdasarkan nama, NIK, atau kota..."
                        className="w-full"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {submissions.length === 0 ? (
                    <Empty>
                        <EmptyMedia>
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyHeader>
                            <EmptyTitle>Tidak ada data</EmptyTitle>
                            <EmptyDescription>
                                {searchQuery
                                    ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                                    : statusFilter !== "all"
                                      ? `Tidak ada formulir dengan status "${statusFilter}"`
                                      : "Belum ada formulir yang masuk"}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Lengkap</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Kota
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            User Akun
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Tanggal
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map((submission) => {
                                        const fullName = [
                                            submission.namaDepan,
                                            submission.namaBelakang,
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                        return (
                                            <TableRow key={submission.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {fullName || "-"}
                                                    </div>
                                                    {submission.namaAlias && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Alias:{" "}
                                                            {
                                                                submission.namaAlias
                                                            }
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {submission.kota || "-"}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="text-sm">
                                                        {submission.userName ||
                                                            "-"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {submission.userEmail ||
                                                            "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        submission.status,
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="text-sm">
                                                        {(() => {
                                                            const date =
                                                                new Date(
                                                                    submission.createdAt,
                                                                );
                                                            const day = date
                                                                .getDate()
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    "0",
                                                                );
                                                            const month = (
                                                                date.getMonth() +
                                                                1
                                                            )
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    "0",
                                                                );
                                                            const year =
                                                                date.getFullYear();
                                                            return `${day}/${month}/${year}`;
                                                        })()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <SubmissionActions
                                                        submissionId={
                                                            submission.id
                                                        }
                                                        submitterName={
                                                            fullName ||
                                                            "Unknown"
                                                        }
                                                        currentStatus={
                                                            submission.status ||
                                                            "draft"
                                                        }
                                                        rejectionReason={
                                                            submission.rejectionReason
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center">
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
    );
}

/**
 * Server component yang mengakses searchParams di dalam Suspense
 * Ini memastikan akses ke searchParams tidak memblokir render
 */
async function SubmissionsPageContent({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string;
        sortBy?: string;
        sortDirection?: string;
        page?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;
    const statusFilter = params.status || "all";
    const sortBy = params.sortBy || "createdAt";
    const sortDirection = (params.sortDirection || "desc") as "asc" | "desc";
    const currentPage = parseInt(params.page || "1", 10);
    const searchQuery = params.search || "";

    return (
        <div className="flex flex-1 flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Ajuan Pendaftaran
                    </h1>
                    <p className="text-muted-foreground">
                        Verifikasi dan kelola formulir pendaftaran yang masuk
                    </p>
                </div>
            </div>

            {/* Stats Cards dengan Suspense */}
            <Suspense fallback={<StatsCardsSkeleton />}>
                <StatsCards />
            </Suspense>

            {/* Submissions Table dengan Suspense */}
            <Suspense
                key={`${statusFilter}-${sortBy}-${sortDirection}-${currentPage}-${searchQuery}`}
                fallback={<SubmissionsTableSkeleton />}
            >
                <SubmissionsTable
                    statusFilter={statusFilter}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    currentPage={currentPage}
                    searchQuery={searchQuery}
                />
            </Suspense>
        </div>
    );
}

/**
 * Halaman Admin Submissions dengan Suspense boundaries
 * Menggunakan cached data dari data.ts dengan cacheLife('minutes')
 * searchParams diakses di dalam Suspense untuk menghindari blocking route
 */
export default function SubmissionsPage({ searchParams }: PageProps) {
    return (
        <Suspense fallback={<PageContentSkeleton />}>
            <SubmissionsPageContent searchParams={searchParams} />
        </Suspense>
    );
}
