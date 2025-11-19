import { Separator } from "@/components/ui/separator";
import { KPICard } from "@/components/statistics/kpi-card";
import { PopulationSection } from "@/components/statistics/population-section";
import { LegalAdminSection } from "@/components/statistics/legal-admin-section";
import { EconomySection } from "@/components/statistics/economy-section";
import { TrainingSection } from "@/components/statistics/training-section";
import { HealthSection } from "@/components/statistics/health-section";
import { DiscriminationSection } from "@/components/statistics/discrimination-section";
import { SocialAidSection } from "@/components/statistics/social-aid-section";
import {
    getOverallStats,
    getAgeDistribution,
    getEKTPOwnership,
    getSocialSecurityDistribution,
    getEmploymentStatus,
    getJobTypes,
    getTrainingParticipation,
    getMostCommonTraining,
    getRequestedTraining,
    getHealthcareAccess,
    getChronicIllness,
    getDiscriminationExperience,
    getDiscriminationTypes,
    getSocialAidRecipients,
    getDTKSEnrollment,
} from "./data";
import {
    Users,
    CreditCard,
    Briefcase,
    Heart,
    AlertTriangle,
} from "lucide-react";

/**
 * Halaman statistik publik untuk data waria
 */
export default async function StatsPage() {
    const [
        overallStats,
        ageDistribution,
        ektpOwnership,
        socialSecurity,
        employmentStatus,
        jobTypes,
        trainingParticipation,
        commonTraining,
        requestedTraining,
        healthcareAccess,
        chronicIllness,
        discriminationExperience,
        discriminationTypes,
        socialAidRecipients,
        dtksEnrollment,
    ] = await Promise.all([
        getOverallStats(),
        getAgeDistribution(),
        getEKTPOwnership(),
        getSocialSecurityDistribution(),
        getEmploymentStatus(),
        getJobTypes(),
        getTrainingParticipation(),
        getMostCommonTraining(),
        getRequestedTraining(),
        getHealthcareAccess(),
        getChronicIllness(),
        getDiscriminationExperience(),
        getDiscriminationTypes(),
        getSocialAidRecipients(),
        getDTKSEnrollment(),
    ]);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Statistik Data Waria Tanjungpinang
                </h1>
                <p className="text-muted-foreground">
                    Visualisasi data komprehensif responden waria
                </p>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Ringkasan Keseluruhan
                    </h2>
                    <p className="text-muted-foreground">
                        Indikator kunci dari data yang terkumpul
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <KPICard
                        title="Total Responden"
                        value={overallStats.totalRespondents}
                        icon={Users}
                        description="Jumlah total responden terdaftar"
                    />
                    <KPICard
                        title="Memiliki e-KTP"
                        value={`${overallStats.percentageWithEKTP.toFixed(1)}%`}
                        icon={CreditCard}
                        description="Persentase kepemilikan e-KTP"
                    />
                    <KPICard
                        title="Bekerja"
                        value={`${overallStats.percentageWorking.toFixed(1)}%`}
                        icon={Briefcase}
                        description="Persentase yang bekerja"
                    />
                    <KPICard
                        title="Akses Kesehatan"
                        value={`${overallStats.percentageAccessingHealthcare.toFixed(1)}%`}
                        icon={Heart}
                        description="Mengakses layanan kesehatan"
                    />
                    <KPICard
                        title="Alami Diskriminasi"
                        value={`${overallStats.percentageExperiencingDiscrimination.toFixed(1)}%`}
                        icon={AlertTriangle}
                        description="Pernah mengalami diskriminasi"
                    />
                </div>
            </div>

            <Separator />

            {/* Section 1: Population Profile */}
            <PopulationSection ageDistribution={ageDistribution} />

            <Separator />

            {/* Section 2: Legal & Civil Admin */}
            <LegalAdminSection
                ektpOwnership={ektpOwnership}
                socialSecurity={socialSecurity}
            />

            <Separator />

            {/* Section 3: Economy & Employment */}
            <EconomySection
                employmentStatus={employmentStatus}
                jobTypes={jobTypes}
            />

            <Separator />

            {/* Section 4: Training */}
            <TrainingSection
                trainingParticipation={trainingParticipation}
                commonTraining={commonTraining}
                requestedTraining={requestedTraining}
            />

            <Separator />

            {/* Section 5: Health */}
            <HealthSection
                healthcareAccess={healthcareAccess}
                chronicIllness={chronicIllness}
            />

            <Separator />

            {/* Section 6: Discrimination */}
            <DiscriminationSection
                discriminationExperience={discriminationExperience}
                discriminationTypes={discriminationTypes}
            />

            <Separator />

            {/* Section 7: Social Assistance */}
            <SocialAidSection
                socialAidRecipients={socialAidRecipients}
                dtksEnrollment={dtksEnrollment}
            />

            <div className="pt-8 text-center text-sm text-muted-foreground">
                <p>
                    Data ini dikumpulkan untuk tujuan pendataan komunitas waria
                </p>
            </div>
        </div>
    );
}
