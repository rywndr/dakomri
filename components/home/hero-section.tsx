import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-muted-foreground">
                            Program Pendataan Aktif
                        </span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Pendataan Komunitas Waria Wilayah Bintan Raya
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Sebuah inisiatif untuk mendukung pendataan yang akurat
                        dan pemahaman yang lebih baik bersama komunitas waria di
                        wilayah Bintan Raya.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/form">
                                <FileText className="h-5 w-5" />
                                Isi Formulir Pendataan
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="gap-2"
                        >
                            <Link href="#tentang">
                                Pelajari Lebih Lanjut
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute left-0 top-0 -z-10 h-full w-full">
                <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
        </section>
    );
}
