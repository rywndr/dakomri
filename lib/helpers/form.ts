/**
 * Helper functions untuk form utilities
 */

/**
 * Format angka ke format Rupiah Indonesia
 * @param amount - Jumlah dalam angka
 * @returns String format Rupiah
 */
export function formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Parse string Rupiah ke angka
 * @param value - String format Rupiah
 * @returns Angka
 */
export function parseCurrency(value: string): number {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned) || 0;
}

/**
 * Hitung usia dari tanggal lahir
 * @param birthDate - Tanggal lahir
 * @returns Usia dalam tahun
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

/**
 * Estimasi tanggal lahir dari usia
 * @param age - Usia dalam tahun
 * @returns Tanggal lahir estimasi
 */
export function estimateBirthDate(age: number): Date {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    return new Date(birthYear, today.getMonth(), today.getDate());
}

/**
 * Validasi NIK Indonesia (16 digit)
 * @param nik - Nomor Induk Kependudukan
 * @returns Boolean valid/tidak
 */
export function validateNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik);
}

/**
 * Validasi nomor telepon Indonesia
 * @param phone - Nomor telepon
 * @returns Boolean valid/tidak
 */
export function validatePhoneNumber(phone: string): boolean {
    return /^(\+62|62|0)[0-9]{9,12}$/.test(phone);
}

/**
 * Format nomor telepon ke format standar +62
 * @param phone - Nomor telepon
 * @returns Nomor telepon terformat
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Convert to +62 format
    if (cleaned.startsWith("62")) {
        return `+${cleaned}`;
    } else if (cleaned.startsWith("0")) {
        return `+62${cleaned.substring(1)}`;
    }

    return phone;
}

/**
 * Generate ID unik untuk form submission
 * @returns ID unik
 */
export function generateFormId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `form_${timestamp}_${randomStr}`;
}

/**
 * Convert form data arrays ke JSON string untuk database
 * @param data - Data form
 * @returns Data dengan array terkonversi ke JSON string
 */
export function convertArraysToJSON<T extends Record<string, any>>(
    data: T,
): T {
    const result = { ...data };

    for (const key in result) {
        if (Array.isArray(result[key])) {
            (result as any)[key] = JSON.stringify(result[key]);
        }
    }

    return result;
}

/**
 * Parse JSON string arrays dari database ke array
 * @param data - Data dari database
 * @returns Data dengan JSON string terkonversi ke array
 */
export function parseJSONArrays<T extends Record<string, any>>(data: T): T {
    const result = { ...data };

    for (const key in result) {
        if (typeof result[key] === "string") {
            try {
                const parsed = JSON.parse(result[key] as string);
                if (Array.isArray(parsed)) {
                    (result as any)[key] = parsed;
                }
            } catch {
                // Bukan JSON, biarkan sebagai string
            }
        }
    }

    return result;
}

/**
 * Sanitize input text untuk mencegah injection
 * @param text - Text input
 * @returns Text yang sudah disanitasi
 */
export function sanitizeInput(text: string): string {
    return text
        .trim()
        .replace(/[<>]/g, "") // Remove < and >
        .substring(0, 500); // Limit length
}

/**
 * Check apakah form field wajib diisi
 * @param fieldName - Nama field
 * @returns Boolean wajib/tidak
 */
export function isRequiredField(fieldName: string): boolean {
    const requiredFields = [
        "namaDepan",
        "nik",
        "nomorKK",
        "statusKepemilikanEKTP",
        "alamatLengkap",
        "kota",
        "kontakTelp",
    ];

    return requiredFields.includes(fieldName);
}
