import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Kelola data dan verifikasi formulir pendataan komunitas
                </p>
            </div>
        </div>
    );
}
