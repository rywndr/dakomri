import { toast } from "sonner";
import type { ZodError } from "zod";

export const scrollToFirstError = (
    errors: Array<{ path: (string | number)[]; message: string }>,
) => {
    if (errors.length === 0) return;

    // Error pertama
    const firstError = errors[0];
    const fieldName = firstError.path[0] as string;
    const errorMessage = firstError.message;

    // Cari elemen field berdasarkan ID
    const fieldElement = document.getElementById(fieldName);

    if (fieldElement) {
        // Scroll ke field
        fieldElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        // Focus field setelah scroll
        setTimeout(() => {
            fieldElement.focus();
        }, 500);

        // Tampilkan toast
        toast.error("Field wajib tidak terisi", {
            description: errorMessage,
        });
    } else {
        // Fallback jika field tidak ditemukan
        toast.error("Validasi gagal", {
            description: `${errors.length} field wajib belum terisi. Silakan periksa kembali.`,
        });
    }
};

/**
 * Validasi form dengan Zod schema sebelum submit
 */
export const validateAndScroll = <T>(
    values: T,
    schema: {
        safeParse: (
            values: T,
        ) => { success: true; data: T } | { success: false; error: ZodError };
    },
): boolean => {
    const result = schema.safeParse(values);

    if (!result.success) {
        console.log("Validasi gagal:", result.error.errors);
        scrollToFirstError(result.error.errors);
        return false;
    }

    return true;
};
