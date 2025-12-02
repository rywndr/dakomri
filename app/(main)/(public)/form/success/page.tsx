"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";

export default function FormSuccessPage() {
    const router = useRouter();

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
                </CardHeader>

                <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="flex-1"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Kembali ke Beranda
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
