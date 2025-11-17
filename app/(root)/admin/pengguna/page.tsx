import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
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
import { UserActions } from "@/components/admin/user-actions";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { AdminSearch } from "@/components/admin/admin-search";
import { UserFilters } from "@/components/admin/user-filters";
import { Users, Shield, UserCheck } from "lucide-react";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        role?: string;
        status?: string;
    }>;
}

export default async function PenggunaPage({ searchParams }: PageProps) {
    // Verify admin access
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const params = await searchParams;
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

    // Query users from database
    const users = await db
        .select()
        .from(user)
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
