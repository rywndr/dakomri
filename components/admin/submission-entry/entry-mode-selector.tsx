import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Edit3 } from "lucide-react";

interface EntryModeSelectorProps {
    onSelectMode: (mode: "manual" | "bulk") => void;
}

export function EntryModeSelector({ onSelectMode }: EntryModeSelectorProps) {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Buat Pengajuan Baru
                    </h1>
                    <p className="text-muted-foreground">
                        Pilih metode untuk menambahkan pengajuan pendataan
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:max-w-4xl">
                <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg" onClick={() => onSelectMode("manual")}>
                    <CardHeader>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Edit3 className="h-6 w-6" />
                        </div>
                        <CardTitle>Input Manual</CardTitle>
                        <CardDescription>
                            Isi formulir secara manual satu per satu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Cocok untuk satu atau beberapa pengajuan
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Validasi langsung per field
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Lebih detail dan terkontrol
                            </li>
                        </ul>
                        <Button className="mt-6 w-full" onClick={() => onSelectMode("manual")}>
                            Pilih Input Manual
                        </Button>
                    </CardContent>
                </Card>

                <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg" onClick={() => onSelectMode("bulk")}>
                    <CardHeader>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <FileUp className="h-6 w-6" />
                        </div>
                        <CardTitle>Upload Massal</CardTitle>
                        <CardDescription>
                            Unggah file Excel atau CSV untuk banyak pengajuan sekaligus
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Cocok untuk banyak pengajuan
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Lebih cepat dan efisien
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Template tersedia untuk diunduh
                            </li>
                        </ul>
                        <Button className="mt-6 w-full" onClick={() => onSelectMode("bulk")}>
                            Pilih Upload Massal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
