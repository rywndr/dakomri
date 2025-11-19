import { PieChartComponent } from "./pie-chart";
import { BarChartComponent } from "./bar-chart";

interface EconomySectionProps {
    employmentStatus: Array<{ status: string; count: number }>;
    jobTypes: Array<{ jobType: string; count: number }>;
}

export function EconomySection({
    employmentStatus,
    jobTypes,
}: EconomySectionProps) {
    // Transform data untuk charts
    const employmentData = employmentStatus.map((item) => ({
        label: item.status,
        value: item.count,
    }));

    const jobTypesData = jobTypes.map((item) => ({
        label: item.jobType,
        value: item.count,
    }));

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Ekonomi & Ketenagakerjaan
                </h2>
                <p className="text-muted-foreground">
                    Status pekerjaan dan jenis pekerjaan responden
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <PieChartComponent
                    title="Status Pekerjaan"
                    description="Distribusi status pekerjaan responden"
                    data={employmentData}
                    showLabel={true}
                />

                <BarChartComponent
                    title="Jenis Pekerjaan"
                    description="Jenis pekerjaan yang dijalani (yang bekerja)"
                    data={jobTypesData}
                    color="var(--chart-3)"
                />
            </div>
        </div>
    );
}
