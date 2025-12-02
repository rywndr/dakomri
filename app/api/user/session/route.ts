import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * GET /api/user/session
 * Get the current user's session information
 */
export async function GET() {
    // Opt into dynamic rendering
    await connection();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json(
            {
                user: {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image ?? null,
                    role: session.user.role ?? null,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
