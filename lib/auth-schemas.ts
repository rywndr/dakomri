import { z } from "zod";

/**
 * Schema validasi untuk sign in
 */
export const signInSchema = z.object({
    email: z
        .string()
        .min(1, "Email harus diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Password harus diisi")
        .min(8, "Password minimal 8 karakter"),
});

/**
 * Base schema untuk sign up (tanpa refine)
 */
export const signUpBaseSchema = z.object({
    name: z
        .string()
        .min(1, "Nama harus diisi")
        .min(2, "Nama minimal 2 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    email: z
        .string()
        .min(1, "Email harus diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Password harus diisi")
        .min(8, "Password minimal 8 karakter")
        .max(100, "Password maksimal 100 karakter")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password harus mengandung huruf besar, huruf kecil, dan angka",
        ),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
});

/**
 * Schema validasi untuk sign up dengan refine
 */
export const signUpSchema = signUpBaseSchema.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Password tidak cocok",
        path: ["confirmPassword"],
    },
);

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
