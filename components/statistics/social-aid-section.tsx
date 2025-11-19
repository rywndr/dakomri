import { PieChartComponent } from "./pie-chart";

interface SocialAidSectionProps {
    socialAidRecipients: Array<{ receives: string; count: number }>;
    dtksEnrollment: Array<{ enrolled: string; count: number }>;
}

export function SocialAidSection({
    socialAidRecipients,
    dtksEnrollment,
}: SocialAidSectionProps) {
    // Transform data untuk charts
    const socialAidData = socialAidRecipients.map((item) => ({
        label: item.receives,
        value: item.count,
    }));

    const dtksData = dtksEnrollment.map((item) => ({
        label: item.enrolled,
        value: item.count,
    }));

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Bantuan Sosial
                </h2>
                <p className="text-muted-foreground">
                    Akses bantuan sosial dan pendaftaran DTKS responden
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <PieChartComponent
                    title="Penerima Bantuan Sosial"
                    description="Responden yang menerima bantuan sosial"
                    data={socialAidData}
                    showLabel={true}
                />

                <PieChartComponent
                    title="Pendaftaran DTKS"
                    description="Status pendaftaran di DTKS"
                    data={dtksData}
                    showLabel={true}
                />
            </div>
        </div>
    );
}
