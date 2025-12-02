"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLink {
    href: string;
    label: string;
}

const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/statistik", label: "Statistik" },
    { href: "/form", label: "Form" },
    { href: "/kegiatan", label: "Kegiatan" },
];

interface NavLinksProps {
    isAdmin?: boolean;
    className?: string;
    variant?: "desktop" | "mobile";
    onLinkClick?: () => void;
}

export function NavLinks({
    isAdmin = false,
    className,
    variant = "desktop",
    onLinkClick,
}: NavLinksProps) {
    const pathname = usePathname();

    const links = isAdmin
        ? [...navLinks, { href: "/admin", label: "Admin" }]
        : navLinks;

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    if (variant === "mobile") {
        return (
            <nav className={cn("flex flex-col gap-1", className)}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onLinkClick}
                        className={cn(
                            "rounded-md px-4 py-3 text-sm font-medium transition-colors",
                            isActive(link.href)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted",
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        );
    }

    return (
        <nav className={cn("hidden md:flex items-center gap-1", className)}>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
