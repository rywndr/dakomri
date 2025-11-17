import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminFormClient } from "@/components/form/admin-form-client";

export default async function BuatPengajuanPage() {
    // get admin status
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return <AdminFormClient />;
}
