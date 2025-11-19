import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get session from server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to home if not logged in or not admin
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="flex-1">
                {/* Header dengan mobile trigger */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:hidden">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-6" />
                    <h1 className="text-lg font-semibold">Admin Panel</h1>
                </header>

                {/* Main content */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
