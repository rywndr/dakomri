import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq, desc, asc, or, and, count, ilike } from "drizzle-orm";

/**
 * Tipe untuk submission dengan user info
 */
export interface SubmissionWithUser {
    id: string;
    namaDepan: string | null;
    namaBelakang: string | null;
    namaAlias: string | null;
    nik: string | null;
    kota: string | null;
    kontakTelp: string | null;
    status: string | null;
    createdAt: Date;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
}

/**
 * Tipe untuk hasil paginated submissions
 */
export interface PaginatedSubmissions {
    submissions: SubmissionWithUser[];
    total: number;
    totalPages: number;
}

/**
 * Tipe untuk statistik submissions
 */
export interface SubmissionStats {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

/**
 * Parameter untuk fetch submissions
 */
export interface FetchSubmissionsParams {
    statusFilter: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    page: number;
    limit: number;
    searchQuery: string;
}

/**
 * Fetch submissions dengan pagination, filtering, dan sorting
 * Cached dengan cacheLife 'minutes' untuk performa
 */
export async function getSubmissions(
    params: FetchSubmissionsParams,
): Promise<PaginatedSubmissions> {
    "use cache";
    cacheLife("minutes");
    cacheTag("admin-submissions", `submissions-page-${params.page}`);

    const { statusFilter, sortBy, sortDirection, page, limit, searchQuery } =
        params;
    const offset = (page - 1) * limit;

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

    // Add search conditions
    if (searchQuery) {
        conditions.push(
            or(
                ilike(formSubmission.namaDepan, `%${searchQuery}%`),
                ilike(formSubmission.namaBelakang, `%${searchQuery}%`),
                ilike(formSubmission.namaAlias, `%${searchQuery}%`),
                ilike(formSubmission.nik, `%${searchQuery}%`),
                ilike(formSubmission.kota, `%${searchQuery}%`),
            )!,
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
        .limit(limit)
        .offset(offset);

    // Get total count
    const [totalResult] = await db
        .select({ count: count() })
        .from(formSubmission)
        .where(whereClause);

    const total = totalResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
        submissions,
        total,
        totalPages,
    };
}

/**
 * Fetch statistik submissions (pending, approved, rejected counts)
 * Cached dengan cacheLife 'minutes'
 */
export async function getSubmissionStats(): Promise<SubmissionStats> {
    "use cache";
    cacheLife("minutes");
    cacheTag("admin-submissions", "submission-stats");

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

    return {
        pendingCount: submittedCount?.count || 0,
        approvedCount: verifiedCount?.count || 0,
        rejectedCount: rejectedCount?.count || 0,
    };
}

/**
 * Get single submission by ID
 * Cached dengan cacheTag per submission untuk targeted revalidation
 */
export async function getSubmissionById(id: string) {
    "use cache";
    cacheLife("minutes");
    cacheTag(`submission-${id}`, "admin-submissions");

    const [submission] = await db
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
        .where(eq(formSubmission.id, id))
        .limit(1);

    return submission || null;
}
