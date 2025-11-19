"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/public/pkbi.png";

interface MobileNavProps {
    isAdmin?: boolean;
}

/**
 * Mobile navigation menggunakan Sheet (drawer)
 * Client component karena memerlukan state untuk toggle
 */
export function MobileNav({ isAdmin = false }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close sheet saat link diklik
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/statistik", label: "Statistik" },
        { href: "/form", label: "Form" },
        { href: "/kegiatan", label: "Kegiatan" },
    ];

    if (isAdmin) {
        navLinks.push({ href: "/admin", label: "Admin" });
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                        <Image
                            src={Logo}
                            alt="PKBI Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span>DAKOMRI</span>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleLinkClick}
                            className="rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
