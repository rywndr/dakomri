import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/helpers";
import { User } from "lucide-react";

interface ProfileHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <Avatar className="size-20 sm:size-24">
                        <AvatarImage
                            src={user.image || undefined}
                            alt={user.name || "User"}
                        />
                        <AvatarFallback className="text-2xl">
                            {user.name ? (
                                getInitials(user.name)
                            ) : (
                                <User className="size-8" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {user.name || "User"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground pt-2">
                            Kelola informasi profil dan keamanan akun Anda
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
