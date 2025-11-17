"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    FileText,
    UserCog,
    LayoutDashboard,
    ChevronRight,
    FilePlus,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
    {
        title: "Ajuan Pendaftaran",
        href: "/admin/submissions",
        icon: FileText,
        badge: null,
    },
    {
        title: "Buat Pengajuan",
        href: "/admin/buat-pengajuan",
        icon: FilePlus,
        badge: null,
    },
    {
        title: "Komunitas",
        href: "/admin/komunitas",
        icon: Users,
        badge: null,
    },
    {
        title: "Pengguna",
        href: "/admin/pengguna",
        icon: UserCog,
        badge: null,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="top-16 h-[calc(100vh-4rem)]">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <LayoutDashboard className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Admin Panel
                                    </span>
                                    <span className="truncate text-xs">
                                        DAKOMRI
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Administrasi</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {isActive && (
                                                    <ChevronRight className="ml-auto size-4" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm">
                            <Link href="/">
                                <ChevronRight className="size-4 rotate-180" />
                                <span>Kembali ke Beranda</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
