import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DukunganSection() {
    return (
        <section className="bg-muted/30 py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Didukung Oleh
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Program ini terselenggara berkat dukungan dari
                            berbagai pihak
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                                <div className="relative h-24 w-32 md:h-48 md:w-56 hover:grayscale-0 transition-all duration-300">
                                    <Image
                                        src="/stti.png"
                                        fill
                                        className="object-contain"
                                        alt="Logo STT Indonesia Tanjungpinang"
                                    />
                                </div>
                                <div className="relative h-24 w-32 md:h-48 md:w-56 hover:grayscale-0 transition-all duration-300">
                                    <Image
                                        src="/pkbi.png"
                                        fill
                                        className="object-contain"
                                        alt="Logo PKBI"
                                    />
                                </div>
                            </div>
                            <p className="mt-16 text-center text-sm text-muted-foreground">
                                Terima kasih kepada semua pihak yang mendukung
                                program pendataan ini
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
