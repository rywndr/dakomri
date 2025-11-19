import { PieChartComponent } from "./pie-chart";
import { BarChartComponent } from "./bar-chart";

interface DiscriminationSectionProps {
    discriminationExperience: Array<{ experienced: string; count: number }>;
    discriminationTypes: Array<{ type: string; count: number }>;
}

export function DiscriminationSection({
    discriminationExperience,
    discriminationTypes,
}: DiscriminationSectionProps) {
    // Transform data untuk charts
    const experienceData = discriminationExperience.map((item) => ({
        label: item.experienced,
        value: item.count,
    }));

    const typesData = discriminationTypes.map((item) => ({
        label: item.type,
        value: item.count,
    }));

    return (
        <div className="space-y-3 md:space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Diskriminasi & Kekerasan
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Pengalaman diskriminasi yang dialami responden
                </p>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <PieChartComponent
                    title="Pengalaman Diskriminasi"
                    description="Responden yang pernah mengalami diskriminasi"
                    data={experienceData}
                    showLabel={true}
                />

                <BarChartComponent
                    title="Jenis Diskriminasi"
                    description="Tipe diskriminasi yang dialami"
                    data={typesData}
                    color="var(--chart-2)"
                />
            </div>
        </div>
    );
}
