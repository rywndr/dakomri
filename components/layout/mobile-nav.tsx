"use client";

import { useState } from "react";
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
import { NavLinks } from "./nav-links";
import Logo from "@/public/pkbi.png";

interface MobileNavProps {
    isAdmin?: boolean;
}

/**
 * MobileNav - Mobile navigation using Sheet (drawer)
 * Uses NavLinks component for consistent navigation
 */
export function MobileNav({ isAdmin = false }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

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
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
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

                <div className="mt-6">
                    <NavLinks
                        isAdmin={isAdmin}
                        variant="mobile"
                        onLinkClick={handleLinkClick}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
