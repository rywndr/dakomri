import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function PostNotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-6">
                        <FileQuestion className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">
                        Kegiatan Tidak Ditemukan
                    </h1>
                    <p className="text-muted-foreground">
                        Maaf, kegiatan yang Anda cari tidak ditemukan atau sudah
                        tidak tersedia.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/kegiatan">
                        <Button
                            variant="default"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Kegiatan
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full sm:w-auto">
                            Ke Beranda
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
