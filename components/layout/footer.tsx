import Image from "next/image";
import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    Facebook,
    Youtube,
    Twitter,
    Instagram,
} from "lucide-react";
import LogoPKBI from "@/public/pkbi.png";
import LogoSTTI from "@/public/stti.png";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src={LogoPKBI}
                                alt="PKBI Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <h3 className="text-lg font-bold">DAKOMRI</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Pendataan Komunitas Waria Wilayah Bintan Raya untuk
                            mendukung pemahaman yang lebih baik dan
                            inklusivitas.
                        </p>
                    </div>

                    {/* QL */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Menu</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/statistik"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Statistik
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/form"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Form Pendataan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kegiatan"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Kegiatan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Kontak</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Tanjungpinang, Kepulauan Riau, Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <a
                                    href="tel:+6281234567890"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    +62 812-3456-7890
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <a
                                    href="mailto:info@dakomri.org"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    info@dakomri.org
                                </a>
                            </li>
                        </ul>

                        {/* Sos Med */}
                        <div className="flex gap-3 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Dukungan */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Didukung Oleh</h4>
                        <div className="flex flex-col gap-4">
                            <div className="relative h-20 w-24 grayscale hover:grayscale-0 transition-all duration-300">
                                <Image
                                    src={LogoSTTI}
                                    fill
                                    className="object-contain"
                                    alt="Logo STT Indonesia Tanjungpinang"
                                />
                            </div>
                            <div className="relative h-20 w-24 grayscale hover:grayscale-0 transition-all duration-300">
                                <Image
                                    src={LogoPKBI}
                                    fill
                                    className="object-contain"
                                    alt="Logo PKBI"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                        <p>
                            &copy; {new Date().getFullYear()} DAKOMRI. All
                            rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                href="/privacy"
                                className="hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
