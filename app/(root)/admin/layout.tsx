import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
        <div className="relative">
            <SidebarProvider>
                <div className="flex w-full">
                    <AdminSidebar />
                    <SidebarInset className="flex-1">
                        <main className="flex flex-1 flex-col gap-4 p-4 pt-6">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
