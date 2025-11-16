/**
 * Truncate string dengan ...
 * @param str - String yang akan di-truncate
 * @param maxLength - Panjang maksimal string
 * @returns String yang dah di-truncate
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter dari setiap kata
 * @param str - String yang akan diapitalisasi
 * @returns String dengan huruf pertama kapital
 */
export function capitalize(str: string): string {
    return str
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
}
