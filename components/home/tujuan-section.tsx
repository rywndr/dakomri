import { Target, Database, Megaphone, TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const goals = [
    {
        icon: Database,
        title: "Data Akurat & Terpusat",
        description:
            "Mengumpulkan data yang valid dan komprehensif untuk pemetaan kebutuhan komunitas yang lebih baik.",
    },
    {
        icon: Megaphone,
        title: "Dasar Advokasi & Kebijakan",
        description:
            "Menyediakan landasan data yang kuat untuk mendukung advokasi hak dan penyusunan kebijakan yang inklusif.",
    },
    {
        icon: Target,
        title: "Program Pemberdayaan",
        description:
            "Merancang dan mengimplementasikan program pemberdayaan yang tepat sasaran sesuai dengan kebutuhan riil komunitas.",
    },
    {
        icon: TrendingUp,
        title: "Peningkatan Kesejahteraan",
        description:
            "Berkontribusi pada peningkatan kualitas hidup dan kesejahteraan anggota komunitas secara menyeluruh.",
    },
];

export function TujuanSection() {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Tujuan Utama Kami
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Program pendataan dengan fokus pada pemberdayaan dan
                        kesejahteraan komunitas
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {goals.map((goal, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden transition-all hover:shadow-lg"
                        >
                            <CardHeader>
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <goal.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">
                                    {goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {goal.description}
                                </CardDescription>
                            </CardContent>
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-primary/0 via-primary to-primary/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
