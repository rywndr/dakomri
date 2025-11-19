import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import Logo from "@/public/pkbi.png";

/**
 * Navbar component dengan desktop dan mobile navigation
 * Server component - mobile nav di-render sebagai client component terpisah
 */
export async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isAdmin = session?.user?.role === "admin";

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Mobile Nav Toggle */}
                <MobileNav isAdmin={isAdmin} />

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 font-bold text-lg hover:opacity-80 transition-opacity"
                >
                    <Image
                        src={Logo}
                        alt="PKBI Logo"
                        width={38}
                        height={38}
                        className="object-contain"
                    />

                    <span className="relative">
                        DAKOMRI
                        <span className="absolute -top-1 -right-3 text-[0.65rem]">
                            ©
                        </span>
                    </span>
                </Link>

                {/* Nav links */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/"
                                className={navigationMenuTriggerStyle()}
                            >
                                Home
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/statistik"
                                className={navigationMenuTriggerStyle()}
                            >
                                Statistik
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/form"
                                className={navigationMenuTriggerStyle()}
                            >
                                Form
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/kegiatan"
                                className={navigationMenuTriggerStyle()}
                            >
                                Kegiatan
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        {isAdmin && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/admin"
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Admin
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* User Menu */}
                <UserMenu session={session} />
            </div>
        </nav>
    );
}
