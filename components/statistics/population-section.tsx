import { BarChartComponent } from "./bar-chart";

interface PopulationSectionProps {
    ageDistribution: Array<{ ageRange: string; count: number }>;
}

export function PopulationSection({ ageDistribution }: PopulationSectionProps) {
    // Transform data untuk chart
    const chartData = ageDistribution.map((item) => ({
        label: item.ageRange,
        value: item.count,
    }));

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Profil Populasi
                </h2>
                <p className="text-muted-foreground">
                    Distribusi demografi responden
                </p>
            </div>

            <div className="grid gap-4">
                <BarChartComponent
                    title="Distribusi Usia"
                    description="Jumlah responden berdasarkan kelompok usia"
                    data={chartData}
                    color="var(--chart-1)"
                />
            </div>
        </div>
    );
}
