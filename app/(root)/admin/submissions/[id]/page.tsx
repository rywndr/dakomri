import { notFound } from "next/navigation";
import { db } from "@/drizzle/db";
import { formSubmission, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Briefcase,
    GraduationCap,
    Heart,
    Shield,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
} from "lucide-react";
import Link from "next/link";
import { SubmissionDetailActions } from "@/components/admin/submission-detail-actions";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch submission with user info
    const [submission] = await db
        .select({
            // All submission fields
            submission: formSubmission,
            // User info
            userName: user.name,
            userEmail: user.email,
        })
        .from(formSubmission)
        .leftJoin(user, eq(formSubmission.userId, user.id))
        .where(eq(formSubmission.id, id))
        .limit(1);

    if (!submission) {
        notFound();
    }

    const data = submission.submission;
    const fullName = [data.namaDepan, data.namaBelakang]
        .filter(Boolean)
        .join(" ");

    // Parse JSON fields
    const jenisPelatihanDiikuti = data.jenisPelatihanDiikuti
        ? JSON.parse(data.jenisPelatihanDiikuti)
        : [];
    const penyelenggaraPelatihan = data.penyelenggaraPelatihan
        ? JSON.parse(data.penyelenggaraPelatihan)
        : [];
    const pelatihanDiinginkan = data.pelatihanDiinginkan
        ? JSON.parse(data.pelatihanDiinginkan)
        : [];
    const jenisDisabilitas = data.jenisDisabilitas
        ? JSON.parse(data.jenisDisabilitas)
        : [];
    const jenisDiskriminasi = data.jenisDiskriminasi
        ? JSON.parse(data.jenisDiskriminasi)
        : [];
    const pelakuDiskriminasi = data.pelakuDiskriminasi
        ? JSON.parse(data.pelakuDiskriminasi)
        : [];
    const lokasiKejadian = data.lokasiKejadian
        ? JSON.parse(data.lokasiKejadian)
        : [];
    const bantuanSosialLainnya = data.bantuanSosialLainnya
        ? JSON.parse(data.bantuanSosialLainnya)
        : [];

    return (
        <div className="flex flex-1 flex-col gap-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/submissions">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Submission
                            </h1>
                            <p className="text-muted-foreground">
                                Informasi lengkap formulir pendaftaran
                            </p>
                        </div>
                    </div>
                </div>
                <SubmissionDetailActions
                    submissionId={data.id}
                    currentStatus={data.status || "draft"}
                    submitterName={fullName}
                />
            </div>

            {/* Status Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{fullName}</CardTitle>
                            <CardDescription>
                                {data.namaAlias &&
                                    `Alias: ${data.namaAlias} • `}
                                NIK: {data.nik}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {data.status === "submitted" && (
                                <Badge variant="outline" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    Menunggu Verifikasi
                                </Badge>
                            )}
                            {data.status === "verified" && (
                                <Badge
                                    variant="default"
                                    className="bg-green-600 gap-1"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    Disetujui
                                </Badge>
                            )}
                            {data.status === "rejected" && (
                                <Badge variant="destructive" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Ditolak
                                </Badge>
                            )}
                            {data.status === "draft" && (
                                <Badge variant="secondary">Draft</Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Tanggal Submit
                            </p>
                            <p className="font-medium">
                                {new Date(data.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </p>
                        </div>
                        {data.verifiedAt && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal Verifikasi
                                </p>
                                <p className="font-medium">
                                    {new Date(
                                        data.verifiedAt,
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        )}
                        {submission.userName && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    User Account
                                </p>
                                <p className="font-medium">
                                    {submission.userName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {submission.userEmail}
                                </p>
                            </div>
                        )}
                    </div>
                    {data.adminNotes && (
                        <>
                            <Separator className="my-4" />
                            <div>
                                <p className="text-sm font-medium mb-2">
                                    Catatan Admin
                                </p>
                                <div className="bg-muted rounded-lg p-3">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {data.adminNotes}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                    {data.rejectionReason && (
                        <>
                            <Separator className="my-4" />
                            <div>
                                <p className="text-sm font-medium mb-2 text-destructive">
                                    Alasan Penolakan
                                </p>
                                <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {data.rejectionReason}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Section 1: Data Pribadi */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Data Pribadi</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem label="Nama Depan" value={data.namaDepan} />
                        <DataItem
                            label="Nama Belakang"
                            value={data.namaBelakang}
                        />
                        <DataItem label="Nama Alias" value={data.namaAlias} />
                        <DataItem
                            label="Tempat Lahir"
                            value={data.tempatLahir}
                        />
                        <DataItem
                            label="Tanggal Lahir"
                            value={
                                data.tanggalLahir
                                    ? new Date(
                                          data.tanggalLahir,
                                      ).toLocaleDateString("id-ID")
                                    : null
                            }
                        />
                        <DataItem label="Usia" value={data.usia?.toString()} />
                        <DataItem
                            label="Jenis Kelamin"
                            value={data.jenisKelamin}
                        />
                        <DataItem
                            label="Identitas Gender"
                            value={data.identitasGender}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 2: Dokumen Kependudukan */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Dokumen Kependudukan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem label="NIK" value={data.nik} />
                        <DataItem label="Nomor KK" value={data.nomorKK} />
                        <DataItem
                            label="Status Kepemilikan e-KTP"
                            value={data.statusKepemilikanEKTP}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 3: Alamat */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Alamat</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Alamat Lengkap"
                            value={data.alamatLengkap}
                            className="md:col-span-2"
                        />
                        <DataItem label="Kelurahan" value={data.kelurahan} />
                        <DataItem label="Kecamatan" value={data.kecamatan} />
                        <DataItem label="Kabupaten" value={data.kabupaten} />
                        <DataItem label="Kota" value={data.kota} />
                        <DataItem
                            label="Status Kependudukan"
                            value={data.statusKependudukan}
                        />
                        <DataItem
                            label="Status Tempat Tinggal"
                            value={data.statusTempatTinggal}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 4: Kontak */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Kontak</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Nomor Telepon"
                            value={data.kontakTelp}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 5: Pekerjaan & Ekonomi */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Pekerjaan & Ekonomi</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Status Perkawinan"
                            value={data.statusPerkawinan}
                        />
                        <DataItem
                            label="Pendidikan Terakhir"
                            value={data.pendidikanTerakhir}
                        />
                        <DataItem
                            label="Status Pekerjaan"
                            value={data.statusPekerjaan}
                        />
                        <DataItem
                            label="Jenis Pekerjaan"
                            value={data.jenisPekerjaan}
                        />
                        <DataItem
                            label="Pendapatan Bulanan"
                            value={
                                data.pendapatanBulanan
                                    ? new Intl.NumberFormat("id-ID", {
                                          style: "currency",
                                          currency: "IDR",
                                      }).format(Number(data.pendapatanBulanan))
                                    : null
                            }
                        />
                        <DataItem
                            label="Memiliki Usaha"
                            value={
                                data.memilikiUsaha === true
                                    ? "Ya"
                                    : data.memilikiUsaha === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        {data.memilikiUsaha && (
                            <DataItem
                                label="Detail Usaha"
                                value={data.detailUsaha}
                                className="md:col-span-2"
                            />
                        )}
                    </dl>
                </CardContent>
            </Card>

            {/* Section 6: Pelatihan */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Pelatihan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4">
                        <DataItem
                            label="Pernah Ikut Pelatihan Keterampilan"
                            value={
                                data.pernahPelatihanKeterampilan === true
                                    ? "Ya"
                                    : data.pernahPelatihanKeterampilan === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        {data.pernahPelatihanKeterampilan && (
                            <>
                                <ArrayDataItem
                                    label="Jenis Pelatihan yang Diikuti"
                                    items={jenisPelatihanDiikuti}
                                />
                                <ArrayDataItem
                                    label="Penyelenggara Pelatihan"
                                    items={penyelenggaraPelatihan}
                                />
                            </>
                        )}
                        <ArrayDataItem
                            label="Pelatihan yang Diinginkan"
                            items={pelatihanDiinginkan}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 7: Jaminan Sosial */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Jaminan Sosial</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Jenis Jaminan Sosial"
                            value={data.jenisJaminanSosial}
                        />
                        <DataItem
                            label="Nomor Identitas Jaminan"
                            value={data.nomorIdentitasJaminan}
                        />
                    </dl>
                </CardContent>
            </Card>

            {/* Section 8: Kesehatan */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Kesehatan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Akses Layanan Kesehatan"
                            value={data.aksesLayananKesehatan}
                        />
                        <DataItem
                            label="Ada Penyakit Kronis"
                            value={
                                data.adaPenyakitKronis === true
                                    ? "Ya"
                                    : data.adaPenyakitKronis === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        {data.adaPenyakitKronis && (
                            <DataItem
                                label="Detail Penyakit Kronis"
                                value={data.detailPenyakitKronis}
                                className="md:col-span-2"
                            />
                        )}
                    </dl>
                </CardContent>
            </Card>

            {/* Section 9: Disabilitas */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Disabilitas</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4">
                        <DataItem
                            label="Penyandang Disabilitas"
                            value={
                                data.penyandangDisabilitas === true
                                    ? "Ya"
                                    : data.penyandangDisabilitas === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        {data.penyandangDisabilitas && (
                            <ArrayDataItem
                                label="Jenis Disabilitas"
                                items={jenisDisabilitas}
                            />
                        )}
                    </dl>
                </CardContent>
            </Card>

            {/* Section 10: Diskriminasi & Kekerasan */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Diskriminasi & Kekerasan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4">
                        <DataItem
                            label="Pernah Mengalami Diskriminasi"
                            value={data.pernahDiskriminasi}
                        />
                        {data.pernahDiskriminasi === "Pernah mengalami" && (
                            <>
                                <ArrayDataItem
                                    label="Jenis Diskriminasi"
                                    items={jenisDiskriminasi}
                                />
                                <ArrayDataItem
                                    label="Pelaku Diskriminasi"
                                    items={pelakuDiskriminasi}
                                />
                                <ArrayDataItem
                                    label="Lokasi Kejadian"
                                    items={lokasiKejadian}
                                />
                                <DataItem
                                    label="Diskriminasi Dilaporkan"
                                    value={
                                        data.diskriminasiDilaporkan === true
                                            ? "Ya"
                                            : data.diskriminasiDilaporkan ===
                                                false
                                              ? "Tidak"
                                              : null
                                    }
                                />
                            </>
                        )}
                    </dl>
                </CardContent>
            </Card>

            {/* Section 11: Bantuan Sosial & Komunitas */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Bantuan Sosial & Komunitas</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <DataItem
                            label="Menerima Bantuan Sosial"
                            value={
                                data.menerimaBantuanSosial === true
                                    ? "Ya"
                                    : data.menerimaBantuanSosial === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        <DataItem
                            label="Terdaftar DTKS"
                            value={
                                data.terdaftarDTKS === true
                                    ? "Ya"
                                    : data.terdaftarDTKS === false
                                      ? "Tidak"
                                      : null
                            }
                        />
                        <ArrayDataItem
                            label="Bantuan Sosial Lainnya"
                            items={bantuanSosialLainnya}
                            className="md:col-span-2"
                        />
                        <DataItem
                            label="Kelompok/Komunitas"
                            value={data.kelompokKomunitas}
                            className="md:col-span-2"
                        />
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper component for displaying data items
function DataItem({
    label,
    value,
    className,
}: {
    label: string;
    value?: string | null;
    className?: string;
}) {
    return (
        <div className={className}>
            <dt className="text-sm font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm">
                {value || (
                    <span className="text-muted-foreground italic">
                        Tidak diisi
                    </span>
                )}
            </dd>
        </div>
    );
}

// Helper component for displaying array data
function ArrayDataItem({
    label,
    items,
    className,
}: {
    label: string;
    items: string[];
    className?: string;
}) {
    return (
        <div className={className}>
            <dt className="text-sm font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1">
                {items.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {items.map((item, index) => (
                            <li key={index} className="text-sm">
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span className="text-sm text-muted-foreground italic">
                        Tidak ada data
                    </span>
                )}
            </dd>
        </div>
    );
}
