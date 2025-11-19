import { DonutChartComponent } from "./donut-chart";
import { BarChartComponent } from "./bar-chart";

interface LegalAdminSectionProps {
    ektpOwnership: Array<{ status: string; count: number }>;
    socialSecurity: Array<{ type: string; count: number }>;
}

export function LegalAdminSection({
    ektpOwnership,
    socialSecurity,
}: LegalAdminSectionProps) {
    // Transform data untuk charts
    const ektpData = ektpOwnership.map((item) => ({
        label: item.status,
        value: item.count,
    }));

    const socialSecurityData = socialSecurity.map((item) => ({
        label: item.type,
        value: item.count,
    }));

    return (
        <div className="space-y-3 md:space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Administrasi Kependudukan & Jaminan Sosial
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Status dokumen dan jaminan sosial responden
                </p>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <DonutChartComponent
                    title="Kepemilikan e-KTP"
                    description="Status kepemilikan e-KTP responden"
                    data={ektpData}
                />

                <BarChartComponent
                    title="Jaminan Sosial"
                    description="Jenis jaminan sosial yang dimiliki"
                    data={socialSecurityData}
                    color="var(--chart-2)"
                />
            </div>
        </div>
    );
}
