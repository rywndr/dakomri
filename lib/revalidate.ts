"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidate form status cache untuk user tertentu
 * Digunakan setelah user submit, update, atau delete form submission
 */
export async function revalidateFormStatus(userId: string) {
    revalidateTag(`user-${userId}`, "max");
    revalidateTag("form-status", "max");
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
