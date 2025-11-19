import { SignInForm, SignUpForm } from "@/components/auth/auth-forms";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function AuthPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-2 text-center">
                    <div className="mx-auto mb-4 size-28 relative">
                        <Image
                            src="/pkbi.png"
                            alt="PKBI Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Selamat Datang</CardTitle>
                        <CardDescription>
                            Masuk atau buat akun untuk melanjutkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signin">Masuk</TabsTrigger>
                                <TabsTrigger value="signup">Daftar</TabsTrigger>
                            </TabsList>
                            <TabsContent value="signin" className="mt-6">
                                <SignInForm />
                            </TabsContent>
                            <TabsContent value="signup" className="mt-6">
                                <SignUpForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan
                    kami
                </p>
            </div>
        </div>
    );
}
