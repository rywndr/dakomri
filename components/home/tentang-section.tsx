import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function TentangSection() {
    return (
        <section id="tentang" className="bg-muted/30 py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Tentang Program Ini
                        </h2>
                    </div>

                    <Card className="border-2">
                        <CardContent className="p-8 md:p-12">
                            <p className="text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
                                Program pendataan ini bertujuan untuk
                                mengumpulkan informasi yang valid dan
                                komprehensif mengenai komunitas waria di wilayah
                                Bintan Raya. Data yang terkumpul akan digunakan
                                secara bertanggung jawab untuk advokasi,
                                perencanaan program pemberdayaan, dan
                                peningkatan akses terhadap layanan yang
                                dibutuhkan, demi mewujudkan masyarakat yang
                                lebih inklusif dan suportif.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
