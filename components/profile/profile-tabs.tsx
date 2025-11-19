"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Monitor, Trash2 } from "lucide-react";
import { ProfileTab } from "./tabs/profile-tab";
import { SecurityTab } from "./tabs/security-tab";
import { SessionsTab } from "./tabs/sessions-tab";
import { DeleteAccountTab } from "./tabs/delete-account-tab";

interface ProfileTabsProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    sessions: Array<{
        id: string;
        userAgent?: string | null;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null;
    }>;
}

export function ProfileTabs({ user, sessions }: ProfileTabsProps) {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger
                    value="profile"
                    className="gap-1 flex-col sm:flex-row sm:gap-2 py-2 sm:py-1.5"
                >
                    <User className="size-4" />
                    <span className="text-xs sm:text-sm">Profil</span>
                </TabsTrigger>
                <TabsTrigger
                    value="security"
                    className="gap-1 flex-col sm:flex-row sm:gap-2 py-2 sm:py-1.5"
                >
                    <Shield className="size-4" />
                    <span className="text-xs sm:text-sm">Keamanan</span>
                </TabsTrigger>
                <TabsTrigger
                    value="sessions"
                    className="gap-1 flex-col sm:flex-row sm:gap-2 py-2 sm:py-1.5"
                >
                    <Monitor className="size-4" />
                    <span className="text-xs sm:text-sm">Sesi</span>
                </TabsTrigger>
                <TabsTrigger
                    value="delete"
                    className="gap-1 flex-col sm:flex-row sm:gap-2 py-2 sm:py-1.5"
                >
                    <Trash2 className="size-4" />
                    <span className="text-xs sm:text-sm">Hapus Akun</span>
                </TabsTrigger>
            </TabsList>

            <div className="mt-6">
                <TabsContent value="profile">
                    <ProfileTab user={user} />
                </TabsContent>

                <TabsContent value="security">
                    <SecurityTab />
                </TabsContent>

                <TabsContent value="sessions">
                    <SessionsTab sessions={sessions} />
                </TabsContent>

                <TabsContent value="delete">
                    <DeleteAccountTab />
                </TabsContent>
            </div>
        </Tabs>
    );
}
