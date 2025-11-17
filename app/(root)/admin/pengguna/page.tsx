import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function PenggunaPage() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pengguna
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola akun pengguna dan hak akses
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pengguna
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
                            Admin
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Pengguna dengan role admin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pengguna Biasa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Role user biasa
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Login Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Aktivitas login
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                    <CardDescription>
                        Daftar pengguna terdaftar dan kelola hak akses
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
