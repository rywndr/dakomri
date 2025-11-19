import { PieChartComponent } from "./pie-chart";
import { DonutChartComponent } from "./donut-chart";

interface HealthSectionProps {
    healthcareAccess: Array<{ access: string; count: number }>;
    chronicIllness: Array<{ hasIllness: string; count: number }>;
}

export function HealthSection({
    healthcareAccess,
    chronicIllness,
}: HealthSectionProps) {
    // Transform data untuk charts
    const accessData = healthcareAccess.map((item) => ({
        label: item.access,
        value: item.count,
    }));

    const illnessData = chronicIllness.map((item) => ({
        label: item.hasIllness,
        value: item.count,
    }));

    return (
        <div className="space-y-3 md:space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Kesehatan
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Akses layanan kesehatan dan kondisi kesehatan responden
                </p>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <PieChartComponent
                    title="Akses Layanan Kesehatan"
                    description="Tempat responden mengakses layanan kesehatan"
                    data={accessData}
                    showLabel={true}
                />

                <DonutChartComponent
                    title="Penyakit Kronis"
                    description="Responden dengan penyakit kronis"
                    data={illnessData}
                />
            </div>
        </div>
    );
}
