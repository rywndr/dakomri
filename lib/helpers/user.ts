/**
 * Helper functions untuk user-related ops
 */

/**
 * Generate inisial dari nama user
 * @param name
 * @returns Inisial (max 2 huruf)
 */
export function getInitials(name?: string | null): string {
    if (!name) return "U";

    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Get role badge color berdasarkan role
 * @param role user
 * @returns CSS class warna badge
 */
export function getRoleBadgeColor(role?: string): string {
    if (role === "admin") {
        return "text-destructive";
    }
    return "text-muted-foreground";
}

/**
 * Format nama user untuk display
 * @param name
 * @param email tuk fallback
 * @returns Display name
 */
export function getDisplayName(
    name?: string | null,
    email?: string | null,
): string {
    return name || email || "User";
}
