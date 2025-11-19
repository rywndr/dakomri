import { PieChartComponent } from "./pie-chart";
import { BarChartComponent } from "./bar-chart";

interface TrainingSectionProps {
    trainingParticipation: Array<{ participated: string; count: number }>;
    commonTraining: Array<{ training: string; count: number }>;
    requestedTraining: Array<{ training: string; count: number }>;
}

export function TrainingSection({
    trainingParticipation,
    commonTraining,
    requestedTraining,
}: TrainingSectionProps) {
    // Transform data untuk charts
    const participationData = trainingParticipation.map((item) => ({
        label: item.participated,
        value: item.count,
    }));

    const commonTrainingData = commonTraining.map((item) => ({
        label: item.training,
        value: item.count,
    }));

    const requestedTrainingData = requestedTraining.map((item) => ({
        label: item.training,
        value: item.count,
    }));

    return (
        <div className="space-y-3 md:space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Pelatihan Keterampilan
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Partisipasi dan kebutuhan pelatihan responden
                </p>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PieChartComponent
                    title="Partisipasi Pelatihan"
                    description="Responden yang pernah mengikuti pelatihan"
                    data={participationData}
                />

                <BarChartComponent
                    title="Pelatihan Paling Umum"
                    description="Pelatihan yang paling banyak diikuti"
                    data={commonTrainingData.slice(0, 5)}
                    color="var(--chart-4)"
                />

                <BarChartComponent
                    title="Pelatihan yang Diinginkan"
                    description="Pelatihan yang paling diminati"
                    data={requestedTrainingData.slice(0, 5)}
                    color="var(--chart-5)"
                />
            </div>
        </div>
    );
}
