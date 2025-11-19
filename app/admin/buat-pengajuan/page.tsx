import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SubmissionEntryWrapper } from "@/components/admin/submission-entry/submission-entry-wrapper";

export default async function BuatPengajuanPage() {
    // get admin status
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return <SubmissionEntryWrapper />;
}
