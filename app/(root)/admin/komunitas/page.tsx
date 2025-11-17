import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function KomunitasPage() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Komunitas
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola data anggota komunitas dan statistik
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Anggota
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Terdaftar di sistem
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aktif Bulan Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            +0% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Terverifikasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Data terverifikasi
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Menunggu verifikasi
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Data Komunitas</CardTitle>
                    <CardDescription>
                        Daftar anggota komunitas terdaftar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        <p>Konten akan ditambahkan nanti</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
