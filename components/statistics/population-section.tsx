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
        <div className="space-y-3 md:space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Profil Populasi
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Distribusi demografi responden
                </p>
            </div>

            <div className="grid gap-3 md:gap-4">
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
