import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";

export default function FormSuccessPage() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-2xl">
            <Card className="border-2">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl text-green-700 dark:text-green-400">
                        Formulir Berhasil Dikirim!
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Terima kasih telah mengisi formulir pendataan komunitas
                    </CardDescription>
                    <CardDescription className="text-sm text-muted-foreground">
                        Silakan refresh halaman untuk melihat status pengiriman
                        terbaru Anda
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
