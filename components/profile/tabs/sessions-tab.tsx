"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Loader2,
    LogOut,
    MapPin,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface SessionsTabProps {
    sessions: Array<{
        id: string;
        userAgent?: string | null;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null;
    }>;
}

function parseUserAgent(userAgent?: string | null) {
    if (!userAgent)
        return { device: "Unknown", browser: "Unknown", icon: Monitor };

    const ua = userAgent.toLowerCase();

    // Detect device
    let device = "Desktop";
    let icon = Monitor;

    if (ua.includes("mobile")) {
        device = "Mobile";
        icon = Smartphone;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
        device = "Tablet";
        icon = Tablet;
    } else if (ua.includes("laptop")) {
        device = "Laptop";
        icon = Laptop;
    }

    // Detect browser
    let browser = "Unknown";
    if (ua.includes("chrome")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari")) browser = "Safari";
    else if (ua.includes("edge")) browser = "Edge";
    else if (ua.includes("opera")) browser = "Opera";

    return { device, browser, icon };
}

export function SessionsTab({ sessions }: SessionsTabProps) {
    const router = useRouter();
    const [loadingSessionId, setLoadingSessionId] = useState<string | null>(
        null,
    );

    /**
     * Handle revoke session
     */
    const handleRevokeSession = async (sessionId: string) => {
        setLoadingSessionId(sessionId);

        try {
            await authClient.revokeSession({
                token: sessionId,
            });

            toast.success("Sesi berhasil dihapus");
            router.refresh();
        } catch (error) {
            console.error("Error revoking session:", error);
            toast.error("Gagal menghapus sesi");
        } finally {
            setLoadingSessionId(null);
        }
    };

    /**
     * Handle revoke semua sesi kecuali yang aktif
     */
    const handleRevokeOtherSessions = async () => {
        setLoadingSessionId("all");

        try {
            await authClient.revokeOtherSessions();

            toast.success("Semua sesi lain berhasil dihapus");
            router.refresh();
        } catch (error) {
            console.error("Error revoking other sessions:", error);
            toast.error("Gagal menghapus sesi lain");
        } finally {
            setLoadingSessionId(null);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Sesi Aktif</CardTitle>
                            <CardDescription>
                                Kelola semua perangkat yang masuk ke akun Anda
                            </CardDescription>
                        </div>
                        {sessions.length > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRevokeOtherSessions}
                                disabled={loadingSessionId === "all"}
                            >
                                {loadingSessionId === "all" ? (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                ) : (
                                    <LogOut className="mr-2 size-4" />
                                )}
                                Hapus Semua Sesi Lain
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Monitor className="size-12 mx-auto mb-4 opacity-50" />
                            <p>Tidak ada sesi aktif</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session, index) => {
                                const deviceInfo = parseUserAgent(
                                    session.userAgent,
                                );
                                const DeviceIcon = deviceInfo.icon;
                                const isCurrentSession = index === 0; // Asumsi sesi pertama adalah sesi aktif

                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        {/* Device Icon */}
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <DeviceIcon className="size-5 text-primary" />
                                        </div>

                                        {/* Session Info */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-sm">
                                                    {deviceInfo.device} •{" "}
                                                    {deviceInfo.browser}
                                                </h4>
                                                {isCurrentSession && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Sesi Ini
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* IP Address */}
                                            {session.ipAddress && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="size-3" />
                                                    <span>
                                                        {session.ipAddress}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Last Active */}
                                            <p className="text-xs text-muted-foreground">
                                                Aktif terakhir:{" "}
                                                {formatDistanceToNow(
                                                    new Date(session.updatedAt),
                                                    {
                                                        addSuffix: true,
                                                        locale: localeId,
                                                    },
                                                )}
                                            </p>

                                            {/* Created At */}
                                            <p className="text-xs text-muted-foreground">
                                                Login:{" "}
                                                {formatDistanceToNow(
                                                    new Date(session.createdAt),
                                                    {
                                                        addSuffix: true,
                                                        locale: localeId,
                                                    },
                                                )}
                                            </p>
                                        </div>

                                        {/* Revoke Button */}
                                        {!isCurrentSession && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRevokeSession(
                                                        session.id,
                                                    )
                                                }
                                                disabled={
                                                    loadingSessionId ===
                                                    session.id
                                                }
                                            >
                                                {loadingSessionId ===
                                                session.id ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <LogOut className="size-4" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
