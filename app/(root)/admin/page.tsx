import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
    // Get session from server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to home if not logged in or not admin
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    // Redirect to submissions page as default admin view
    redirect("/admin/submissions");
}
