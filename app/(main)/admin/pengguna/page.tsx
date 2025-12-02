import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { user, formSubmission } from "@/drizzle/schema";
import { ilike, or, count, asc, eq, and } from "drizzle-orm";
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
import { UserActions } from "@/components/admin/user-actions";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { AdminSearch } from "@/components/admin/admin-search";
import { UserFilters } from "@/components/admin/user-filters";
import { Users, Shield, UserCheck, Link2, Unlink } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
    }>;
}

interface SearchParams {
    page?: string;
    search?: string;
    role?: string;
    status?: string;
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

/**
 * Skeleton untuk tabel pengguna
 */
function UsersTableSkeleton() {
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

/**
 * Skeleton untuk seluruh halaman
 */
function PageSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>
            <StatsCardsSkeleton />
            <UsersTableSkeleton />
        </div>
    );
}

/**
 * Server component untuk authenticated pengguna content
 * Wrapped in Suspense karena menggunakan headers()
 */
async function AuthenticatedPenggunaContent({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    // Await searchParams inside Suspense boundary
    const params = await searchParams;

    // Verify admin access - uses headers() which requires Suspense
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const currentPage = parseInt(params.page || "1", 10);
    const searchQuery = params.search || "";
    const roleFilter = params.role || "all";
    const statusFilter = params.status || "all";
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Search conditions
    if (searchQuery) {
        whereConditions.push(
            or(
                ilike(user.name, `%${searchQuery}%`),
                ilike(user.email, `%${searchQuery}%`),
            )!,
        );
    }

    // Role filter
    if (roleFilter !== "all") {
        whereConditions.push(eq(user.role, roleFilter));
    }

    // Status filter (banned/active)
    if (statusFilter === "banned") {
        whereConditions.push(eq(user.banned, true));
    } else if (statusFilter === "active") {
        whereConditions.push(eq(user.banned, false));
    }

    // Build final where clause
    const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Query users from database with submission info
    const users = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            banned: user.banned,
            createdAt: user.createdAt,
            submissionId: formSubmission.id,
            submissionStatus: formSubmission.status,
        })
        .from(user)
        .leftJoin(formSubmission, eq(user.id, formSubmission.userId))
        .where(whereClause)
        .orderBy(asc(user.name))
        .limit(limit)
        .offset(offset);

    // Get total count
    const [totalResult] = await db
        .select({ count: count() })
        .from(user)
        .where(whereClause);

    const total = totalResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get total users (without pagination)
    const [totalUsersResult] = await db.select({ count: count() }).from(user);
    const totalUsers = totalUsersResult?.count || 0;

    // Calculate stats from current page results
    const adminCount = users.filter((u) => u.role === "admin").length;
    const userCount = users.filter((u) => u.role === "user" || !u.role).length;

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pengguna
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola akun pengguna dan hak akses
                    </p>
                </div>
            </div>

            {/* Statistik */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pengguna
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Terdaftar di sistem
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Admin
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Pengguna dengan role admin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pengguna Biasa
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Role user biasa
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Manajemen Pengguna</CardTitle>
                            <CardDescription>
                                Daftar pengguna terdaftar dan kelola hak akses
                            </CardDescription>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <UserFilters
                            currentRole={roleFilter}
                            currentStatus={statusFilter}
                        />
                    </div>
                    <div className="mt-4">
                        <AdminSearch
                            placeholder="Cari nama atau email pengguna..."
                            searchParam="search"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Status Pengajuan</TableHead>
                                <TableHead>Link Status</TableHead>
                                <TableHead>Terdaftar</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.role || "user"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.banned ? (
                                            <Badge variant="destructive">
                                                diblokir
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                aktif
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.submissionStatus ? (
                                            <Badge
                                                variant={
                                                    user.submissionStatus ===
                                                    "verified"
                                                        ? "default"
                                                        : user.submissionStatus ===
                                                            "submitted"
                                                          ? "secondary"
                                                          : user.submissionStatus ===
                                                              "rejected"
                                                            ? "destructive"
                                                            : "outline"
                                                }
                                            >
                                                {user.submissionStatus ===
                                                "verified"
                                                    ? "terverifikasi"
                                                    : user.submissionStatus ===
                                                        "submitted"
                                                      ? "menunggu"
                                                      : user.submissionStatus ===
                                                          "rejected"
                                                        ? "ditolak"
                                                        : user.submissionStatus}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                belum ada
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.submissionId ? (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <Link2 className="h-4 w-4" />
                                                <span className="text-sm">
                                                    terhubung
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Unlink className="h-4 w-4" />
                                                <span className="text-sm">
                                                    tidak terhubung
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActions
                                            userId={user.id}
                                            currentRole={user.role || null}
                                            userName={user.name}
                                            userEmail={user.email}
                                            isBanned={user.banned || false}
                                            hasSubmission={!!user.submissionId}
                                            submissionId={
                                                user.submissionId || null
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Halaman Admin Pengguna
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 * searchParams diakses di dalam Suspense untuk menghindari blocking route
 */
export default function PenggunaPage({ searchParams }: PageProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <AuthenticatedPenggunaContent searchParams={searchParams} />
        </Suspense>
    );
}
