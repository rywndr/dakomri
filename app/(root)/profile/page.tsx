import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-6 px-4 space-y-6 md:py-8 md:space-y-8 max-w-4xl">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                <Skeleton className="size-24 rounded-full" />
                <div className="space-y-2 text-center md:text-left">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Server component untuk authenticated profile content
 * Wrapped in Suspense karena menggunakan headers()
 */
async function AuthenticatedProfileContent() {
    // Get session dari server - uses headers() which requires Suspense
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

/**
 * Halaman manajemen profil pengguna
 * Menggunakan Suspense boundary untuk dynamic content yang membutuhkan headers()
 */
export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <AuthenticatedProfileContent />
        </Suspense>
    );
}
