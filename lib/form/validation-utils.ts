import { toast } from "sonner";
import type { ZodError } from "zod";

/**
 * Map field names to user-friendly labels for better error messages
 */
const FIELD_LABELS: Record<string, string> = {
    namaDepan: "Nama Depan",
    nik: "NIK",
    nomorKK: "Nomor KK",
    statusKepemilikanEKTP: "Status Kepemilikan E-KTP",
    alamatLengkap: "Alamat Lengkap",
    kota: "Kota",
    kontakTelp: "Kontak Telepon",
    statusPerkawinan: "Status Perkawinan",
    pendidikanTerakhir: "Pendidikan Terakhir",
};

/**
 * Get user-friendly label for a field name
 */
const getFieldLabel = (fieldName: string): string => {
    return FIELD_LABELS[fieldName] || fieldName;
};

/**
 * Find the DOM element for a field, checking multiple possible selectors
 */
const findFieldElement = (fieldName: string): HTMLElement | null => {
    // Try direct ID match first
    let element = document.getElementById(fieldName);
    if (element) return element;

    // For select fields, try to find the trigger button
    element = document.querySelector(
        `[id="${fieldName}"] button, button[id="${fieldName}"]`,
    ) as HTMLElement;
    if (element) return element;

    // Try to find by name attribute
    element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    if (element) return element;

    // Try to find the SelectTrigger for shadcn/ui Select components
    // Look for the container with the field name and find the button inside
    const container = document.querySelector(
        `[data-field="${fieldName}"], .space-y-2:has(label[for="${fieldName}"])`,
    ) as HTMLElement;
    if (container) {
        const selectTrigger = container.querySelector("button") as HTMLElement;
        if (selectTrigger) return selectTrigger;
    }

    // Try to find by label's for attribute and get the associated input/button
    const label = document.querySelector(
        `label[for="${fieldName}"]`,
    ) as HTMLElement;
    if (label) {
        const parent = label.closest(".space-y-2") as HTMLElement;
        if (parent) {
            // Look for input, select trigger, or any focusable element
            const focusable = parent.querySelector(
                "input, button, select, textarea, [tabindex]",
            ) as HTMLElement;
            if (focusable) return focusable;
        }
    }

    return null;
};

/**
 * Scroll to first validation error and show toast with details
 */
export const scrollToFirstError = (
    errors: Array<{ path: (string | number)[]; message: string }>,
) => {
    if (errors.length === 0) return;

    // Get first error details
    const firstError = errors[0];
    const fieldName = firstError.path[0] as string;
    const fieldLabel = getFieldLabel(fieldName);
    const errorMessage = firstError.message;

    // Find field element
    const fieldElement = findFieldElement(fieldName);

    if (fieldElement) {
        // Scroll to field
        fieldElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        // Focus field after scroll completes
        setTimeout(() => {
            fieldElement.focus();
        }, 500);

        // Show toast with specific error
        toast.error(`${fieldLabel} wajib diisi`, {
            description: errorMessage,
        });
    } else {
        // Fallback if field not found - still show meaningful error
        // Build list of all missing fields
        const missingFields = errors
            .map((err) => getFieldLabel(err.path[0] as string))
            .slice(0, 5); // Limit to first 5 for readability

        const description =
            errors.length > 5
                ? `${missingFields.join(", ")} dan ${errors.length - 5} lainnya`
                : missingFields.join(", ");

        toast.error(`${errors.length} field wajib belum terisi`, {
            description: description,
        });

        // Try to scroll to the first section that might contain the error
        // This is a fallback when specific field can't be found
        const formContainer = document.querySelector("form");
        if (formContainer) {
            formContainer.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
};

/**
 * Show all validation errors as individual toasts (for debugging or detailed feedback)
 */
export const showAllErrors = (
    errors: Array<{ path: (string | number)[]; message: string }>,
) => {
    errors.forEach((error, index) => {
        const fieldName = error.path[0] as string;
        const fieldLabel = getFieldLabel(fieldName);

        // Stagger toasts to prevent overwhelming the user
        setTimeout(() => {
            toast.error(`${fieldLabel}: ${error.message}`);
        }, index * 200);
    });
};

/**
 * Validate form with Zod schema before submit
 * Returns true if validation passes, false otherwise
 * Automatically scrolls to first error and shows toast
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
        // Log errors for debugging
        console.log("Validasi gagal:", result.error.errors);

        // Log which fields failed
        const failedFields = result.error.errors.map((err) => ({
            field: err.path[0],
            label: getFieldLabel(err.path[0] as string),
            message: err.message,
        }));
        console.log("Fields yang gagal validasi:", failedFields);

        // Scroll to first error and show toast
        scrollToFirstError(result.error.errors);
        return false;
    }

    return true;
};

/**
 * Validate form and return detailed results without scrolling
 * Useful for custom validation handling
 */
export const validateForm = <T>(
    values: T,
    schema: {
        safeParse: (
            values: T,
        ) => { success: true; data: T } | { success: false; error: ZodError };
    },
): {
    isValid: boolean;
    errors: Array<{
        field: string;
        label: string;
        message: string;
    }>;
    data?: T;
} => {
    const result = schema.safeParse(values);

    if (!result.success) {
        return {
            isValid: false,
            errors: result.error.errors.map((err) => ({
                field: err.path[0] as string,
                label: getFieldLabel(err.path[0] as string),
                message: err.message,
            })),
        };
    }

    return {
        isValid: true,
        errors: [],
        data: result.data,
    };
};
