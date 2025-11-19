import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, UserCheck, FileCheck } from "lucide-react";

const commitments = [
    {
        icon: FileCheck,
        text: "Data dianonimkan untuk laporan dan analisis umum.",
    },
    {
        icon: Lock,
        text: "Akses ke data mentah sangat dibatasi dan diawasi.",
    },
    {
        icon: UserCheck,
        text: "Tidak ada data pribadi yang akan dibagikan kepada pihak ketiga tanpa persetujuan eksplisit.",
    },
    {
        icon: Shield,
        text: "Kami berkomitmen pada penggunaan data yang etis dan bertanggung jawab untuk kemajuan komunitas.",
    },
];

export function KomitmenSection() {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Komitmen Kami
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Kami memahami pentingnya privasi dan keamanan data
                            Anda. Seluruh informasi yang dikumpulkan melalui
                            program ini akan dijaga kerahasiaannya dan hanya
                            akan digunakan untuk tujuan yang telah disebutkan.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {commitments.map((commitment, index) => (
                            <Card
                                key={index}
                                className="group border-2 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                            <commitment.icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base font-medium leading-relaxed">
                                            {commitment.text}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
