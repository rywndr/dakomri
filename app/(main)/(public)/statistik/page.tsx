import { Metadata } from "next";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
 * Skeleton untuk KPI Cards
 */
function KPICardsSkeleton() {
    return (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 md:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-32" />
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton untuk section chart
 */
function SectionSkeleton() {
    return (
        <div className="space-y-4">
            <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-[300px] rounded-lg" />
                <Skeleton className="h-[300px] rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Server component untuk KPI Cards dengan caching
 */
async function OverallStatsSection() {
    const overallStats = await getOverallStats();

    return (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 md:gap-4">
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
    );
}

/**
 * Server component untuk Population Section dengan caching
 */
async function PopulationSectionContent() {
    const ageDistribution = await getAgeDistribution();
    return <PopulationSection ageDistribution={ageDistribution} />;
}

/**
 * Server component untuk Legal Admin Section dengan caching
 */
async function LegalAdminSectionContent() {
    const [ektpOwnership, socialSecurity] = await Promise.all([
        getEKTPOwnership(),
        getSocialSecurityDistribution(),
    ]);
    return (
        <LegalAdminSection
            ektpOwnership={ektpOwnership}
            socialSecurity={socialSecurity}
        />
    );
}

/**
 * Server component untuk Economy Section dengan caching
 */
async function EconomySectionContent() {
    const [employmentStatus, jobTypes] = await Promise.all([
        getEmploymentStatus(),
        getJobTypes(),
    ]);
    return (
        <EconomySection
            employmentStatus={employmentStatus}
            jobTypes={jobTypes}
        />
    );
}

/**
 * Server component untuk Training Section dengan caching
 */
async function TrainingSectionContent() {
    const [trainingParticipation, commonTraining, requestedTraining] =
        await Promise.all([
            getTrainingParticipation(),
            getMostCommonTraining(),
            getRequestedTraining(),
        ]);
    return (
        <TrainingSection
            trainingParticipation={trainingParticipation}
            commonTraining={commonTraining}
            requestedTraining={requestedTraining}
        />
    );
}

/**
 * Server component untuk Health Section dengan caching
 */
async function HealthSectionContent() {
    const [healthcareAccess, chronicIllness] = await Promise.all([
        getHealthcareAccess(),
        getChronicIllness(),
    ]);
    return (
        <HealthSection
            healthcareAccess={healthcareAccess}
            chronicIllness={chronicIllness}
        />
    );
}

/**
 * Server component untuk Discrimination Section dengan caching
 */
async function DiscriminationSectionContent() {
    const [discriminationExperience, discriminationTypes] = await Promise.all([
        getDiscriminationExperience(),
        getDiscriminationTypes(),
    ]);
    return (
        <DiscriminationSection
            discriminationExperience={discriminationExperience}
            discriminationTypes={discriminationTypes}
        />
    );
}

/**
 * Server component untuk Social Aid Section dengan caching
 */
async function SocialAidSectionContent() {
    const [socialAidRecipients, dtksEnrollment] = await Promise.all([
        getSocialAidRecipients(),
        getDTKSEnrollment(),
    ]);
    return (
        <SocialAidSection
            socialAidRecipients={socialAidRecipients}
            dtksEnrollment={dtksEnrollment}
        />
    );
}

/**
 * Halaman statistik publik untuk data waria
 * Menggunakan Suspense boundaries untuk progressive loading
 * Data di-cache dengan cacheLife('days') di data.ts
 */
export default async function StatsPage() {
    return (
        <div className="container mx-auto py-6 px-4 space-y-6 md:py-8 md:space-y-8">
            {/* Header - static content */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Statistik Data Waria Wilayah Bintan Raya
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Visualisasi data komprehensif responden waria di wilayah
                    Bintan Raya
                </p>
            </div>

            <Separator />

            {/* Overall Stats Section */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        Ringkasan Keseluruhan
                    </h2>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Indikator kunci dari data yang terkumpul
                    </p>
                </div>

                <Suspense fallback={<KPICardsSkeleton />}>
                    <OverallStatsSection />
                </Suspense>
            </div>

            <Separator />

            {/* Section 1: Population Profile */}
            <Suspense fallback={<SectionSkeleton />}>
                <PopulationSectionContent />
            </Suspense>

            <Separator />

            {/* Section 2: Legal & Civil Admin */}
            <Suspense fallback={<SectionSkeleton />}>
                <LegalAdminSectionContent />
            </Suspense>

            <Separator />

            {/* Section 3: Economy & Employment */}
            <Suspense fallback={<SectionSkeleton />}>
                <EconomySectionContent />
            </Suspense>

            <Separator />

            {/* Section 4: Training */}
            <Suspense fallback={<SectionSkeleton />}>
                <TrainingSectionContent />
            </Suspense>

            <Separator />

            {/* Section 5: Health */}
            <Suspense fallback={<SectionSkeleton />}>
                <HealthSectionContent />
            </Suspense>

            <Separator />

            {/* Section 6: Discrimination */}
            <Suspense fallback={<SectionSkeleton />}>
                <DiscriminationSectionContent />
            </Suspense>

            <Separator />

            {/* Section 7: Social Assistance */}
            <Suspense fallback={<SectionSkeleton />}>
                <SocialAidSectionContent />
            </Suspense>

            {/* Footer - static content */}
            <div className="pt-6 pb-4 text-center text-xs text-muted-foreground sm:text-sm md:pt-8">
                <p>
                    Data ini dikumpulkan untuk tujuan pendataan dan pemberdayaan
                    komunitas waria di wilayah Bintan Raya
                </p>
            </div>
        </div>
    );
}

/**
 * Metadata untuk halaman
 */
export const metadata: Metadata = {
    title: "Statistik | DAKOMRI",
    description: "Statistik komunitas waria di wilayah Bintan Raya",
};
