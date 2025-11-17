import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FormClient } from "@/components/form/form-client";

export default async function FormPage() {
    // Get session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to auth if not logged in
    if (!session?.user) {
        redirect("/auth");
    }

    return <FormClient />;
}
