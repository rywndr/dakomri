import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq, desc, asc, or, and, count } from "drizzle-orm";
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
import { PaginationControls } from "@/components/admin/pagination-controls";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { SubmissionFilters } from "@/components/admin/submission-filters";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        sortBy?: string;
        sortDirection?: string;
    }>;
}

export default async function SubmissionsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const statusFilter = params.status || "all";
    const sortBy = params.sortBy || "createdAt";
    const sortDirection = (params.sortDirection || "desc") as "asc" | "desc";
    const limit = 10;

    // Build where conditions
    const conditions = [];

    // Filter by status
    if (statusFilter !== "all") {
        conditions.push(eq(formSubmission.status, statusFilter));
    } else {
        // Exclude drafts by default when showing "all"
        conditions.push(
            or(
                eq(formSubmission.status, "submitted"),
                eq(formSubmission.status, "verified"),
                eq(formSubmission.status, "rejected"),
            ),
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sort column
    const getSortColumn = () => {
        switch (sortBy) {
            case "namaDepan":
                return formSubmission.namaDepan;
            case "kota":
                return formSubmission.kota;
            case "verifiedAt":
                return formSubmission.verifiedAt;
            default:
                return formSubmission.createdAt;
        }
    };

    const sortColumn = getSortColumn();

    // Get submissions with user info
    const submissions = await db
        .select({
            id: formSubmission.id,
            namaDepan: formSubmission.namaDepan,
            namaBelakang: formSubmission.namaBelakang,
            namaAlias: formSubmission.namaAlias,
            nik: formSubmission.nik,
            kota: formSubmission.kota,
            kontakTelp: formSubmission.kontakTelp,
            status: formSubmission.status,
            createdAt: formSubmission.createdAt,
            verifiedAt: formSubmission.verifiedAt,
            rejectionReason: formSubmission.rejectionReason,
            userId: formSubmission.userId,
            userName: user.name,
            userEmail: user.email,
        })
        .from(formSubmission)
        .leftJoin(user, eq(formSubmission.userId, user.id))
        .where(whereClause)
        .orderBy(sortDirection === "desc" ? desc(sortColumn) : asc(sortColumn))
        .limit(limit);

    // Get total count
    const [totalResult] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(whereClause);

    const total = totalResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get stats for cards
    const [submittedCount] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(eq(formSubmission.status, "submitted"));

    const [verifiedCount] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(eq(formSubmission.status, "verified"));

    const [rejectedCount] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(eq(formSubmission.status, "rejected"));

    const pendingCount = submittedCount?.count || 0;
    const approvedCount = verifiedCount?.count || 0;
    const rejectedTotal = rejectedCount?.count || 0;

    return (
        <div className="flex flex-1 flex-col gap-4">
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

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Menunggu Verifikasi
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
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
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {approvedCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Sudah diverifikasi
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ditolak
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {rejectedTotal}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tidak memenuhi syarat
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Submissions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daftar Submissions</CardTitle>
                            <CardDescription>
                                Tinjau dan verifikasi formulir pendaftaran
                            </CardDescription>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <SubmissionFilters
                            currentStatus={statusFilter}
                            currentSort={sortBy}
                            currentDirection={sortDirection}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {submissions.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                            <div className="text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="font-medium">
                                    {statusFilter !== "all"
                                        ? "Tidak ada submission yang ditemukan"
                                        : "Belum ada submission masuk"}
                                </p>
                                <p className="text-sm mt-2">
                                    {statusFilter !== "all"
                                        ? "Coba ubah filter atau pencarian Anda"
                                        : "Submission yang diajukan akan muncul di sini"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Kota</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal Submit</TableHead>
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
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>{fullName}</div>
                                                        {submission.namaAlias && (
                                                            <div className="text-xs text-muted-foreground">
                                                                (
                                                                {
                                                                    submission.namaAlias
                                                                }
                                                                )
                                                            </div>
                                                        )}
                                                        {submission.userName && (
                                                            <div className="text-xs text-muted-foreground">
                                                                User:{" "}
                                                                {
                                                                    submission.userName
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                        {submission.nik}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {submission.kota}
                                                </TableCell>
                                                <TableCell>
                                                    {submission.kontakTelp}
                                                </TableCell>
                                                <TableCell>
                                                    {submission.status ===
                                                        "submitted" && (
                                                        <Badge variant="outline">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            Menunggu
                                                        </Badge>
                                                    )}
                                                    {submission.status ===
                                                        "verified" && (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-600"
                                                        >
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                            Disetujui
                                                        </Badge>
                                                    )}
                                                    {submission.status ===
                                                        "rejected" && (
                                                        <Badge variant="destructive">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Ditolak
                                                        </Badge>
                                                    )}
                                                    {submission.status ===
                                                        "draft" && (
                                                        <Badge variant="secondary">
                                                            Draft
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        submission.createdAt,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <SubmissionActions
                                                        submissionId={
                                                            submission.id
                                                        }
                                                        currentStatus={
                                                            submission.status ||
                                                            "draft"
                                                        }
                                                        submitterName={fullName}
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
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
