import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";

/**
 * Halaman manajemen profil pengguna
 * Server component yang fetch data user dan session
 */
export default async function ProfilePage() {
    // Get session dari server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect ke auth jika tidak login
    if (!session?.user) {
        redirect("/auth");
    }

    // Fetch semua sessions user
    const sessions = await auth.api.listSessions({
        headers: await headers(),
    });

    return (
        <div className="container mx-auto py-6 px-4 space-y-6 md:py-8 md:space-y-8 max-w-4xl">
            {/* Header dengan avatar dan info user */}
            <ProfileHeader user={session.user} />

            {/* Tabs untuk manajemen profil */}
            <ProfileTabs
                user={session.user}
                sessions={sessions || []}
                currentSessionId={session.session.id}
            />
        </div>
    );
}
