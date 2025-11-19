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
import Logo from "@/public/pkbi.png";

export async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
                        {session?.user?.role === "admin" && (
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

                <UserMenu session={session} />
            </div>
        </nav>
    );
}
