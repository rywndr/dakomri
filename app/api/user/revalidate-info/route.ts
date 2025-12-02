import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidateUserInfo } from "@/lib/revalidate";

/**
 * POST /api/user/revalidate-info
 * Revalidate user info cache setelah user update profile
 * Hanya user yang sedang login bisa revalidate cache mereka sendiri
 */
export async function POST(req: Request) {
    // Opt into dynamic rendering
    await connection();

    try {
        // Get current user session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Parse request body
        const body = await req.json();
        const { userId } = body;

        // Pastikan user hanya bisa revalidate cache mereka sendiri
        if (userId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden: Cannot revalidate other user's cache" },
                { status: 403 },
            );
        }

        // Revalidate user info cache
        await revalidateUserInfo(userId);

        return NextResponse.json(
            {
                success: true,
                message: "User info cache revalidated",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error revalidating user info:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
