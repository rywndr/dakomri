"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidate form status cache untuk user tertentu
 * Digunakan setelah user submit, update, atau delete form submission
 */
export async function revalidateFormStatus(userId: string) {
    revalidateTag(`form-status-${userId}`, "max");
    revalidateTag("form-status", "max");
}

/**
 * Revalidate user info cache untuk user tertentu
 * Digunakan setelah user update profile (nama, dll)
 */
export async function revalidateUserInfo(userId: string) {
    revalidateTag(`user-info-${userId}`, "max");
    revalidateTag("user-info", "max");
}

/**
 * Revalidate semua form status cache
 * Digunakan oleh admin setelah verify/reject submission
 */
export async function revalidateAllFormStatus() {
    revalidateTag("form-status", "max");
}

/**
 * Revalidate statistik cache
 * Digunakan setelah ada perubahan data yang mempengaruhi statistik
 */
export async function revalidateStatistics() {
    revalidateTag("statistics", "max");
}

/**
 * Revalidate posts/kegiatan cache
 * Digunakan setelah create/update/delete post
 */
export async function revalidatePosts() {
    revalidateTag("posts", "max");
}

/**
 * Revalidate single post cache
 * Digunakan setelah update single post
 */
export async function revalidatePost(postId: string) {
    revalidateTag(`post-${postId}`, "max");
    revalidateTag("posts", "max");
}

/**
 * Revalidate admin submissions cache
 * Uses expire: 0 for immediate invalidation since admin expects instant feedback
 */
export async function revalidateSubmissions() {
    revalidateTag("admin-submissions", { expire: 0 });
}

/**
 * Revalidate submission stats cache
 * Uses expire: 0 for immediate invalidation since admin expects instant feedback
 */
export async function revalidateSubmissionStats() {
    revalidateTag("submission-stats", { expire: 0 });
}

/**
 * Revalidate single submission cache
 * Uses expire: 0 for immediate invalidation since admin expects instant feedback
 */
export async function revalidateSubmission(submissionId: string) {
    revalidateTag(`submission-${submissionId}`, { expire: 0 });
    revalidateTag("admin-submissions", { expire: 0 });
}
