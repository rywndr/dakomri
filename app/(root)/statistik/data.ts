import { db } from "@/drizzle/db";
import { formSubmission } from "@/drizzle/schemas/form-schema";
import { sql, inArray } from "drizzle-orm";

export type OverallStats = {
    totalRespondents: number;
    percentageWithEKTP: number;
    percentageWorking: number;
    percentageAccessingHealthcare: number;
    percentageExperiencingDiscrimination: number;
};

/**
 * Fetch statistik keseluruhan
 */
export async function getOverallStats(): Promise<OverallStats> {
    // Hanya ambil data yang sudah verified atau submitted
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            total: sql<number>`count(*)`,
            withEKTP: sql<number>`count(case when ${formSubmission.statusKepemilikanEKTP} = 'Memiliki' then 1 end)`,
            working: sql<number>`count(case when ${formSubmission.statusPekerjaan} = 'Bekerja' then 1 end)`,
            accessingHealthcare: sql<number>`count(case when ${formSubmission.aksesLayananKesehatan} != 'Tidak Pernah' and ${formSubmission.aksesLayananKesehatan} is not null then 1 end)`,
            experiencingDiscrimination: sql<number>`count(case when ${formSubmission.pernahDiskriminasi} = 'Pernah mengalami' then 1 end)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses));

    const data = results[0];
    const total = Number(data.total) || 0;

    return {
        totalRespondents: total,
        percentageWithEKTP:
            total > 0 ? (Number(data.withEKTP) / total) * 100 : 0,
        percentageWorking: total > 0 ? (Number(data.working) / total) * 100 : 0,
        percentageAccessingHealthcare:
            total > 0 ? (Number(data.accessingHealthcare) / total) * 100 : 0,
        percentageExperiencingDiscrimination:
            total > 0
                ? (Number(data.experiencingDiscrimination) / total) * 100
                : 0,
    };
}

/**
 * Distribusi usia (grouping by range)
 */
export async function getAgeDistribution() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            ageRange: sql<string>`
                case
                    when ${formSubmission.usia} < 20 then '< 20'
                    when ${formSubmission.usia} >= 20 and ${formSubmission.usia} < 30 then '20-29'
                    when ${formSubmission.usia} >= 30 and ${formSubmission.usia} < 40 then '30-39'
                    when ${formSubmission.usia} >= 40 and ${formSubmission.usia} < 50 then '40-49'
                    when ${formSubmission.usia} >= 50 then '50+'
                    else 'Tidak Diketahui'
                end
            `,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses)).groupBy(sql`
            case
                when ${formSubmission.usia} < 20 then '< 20'
                when ${formSubmission.usia} >= 20 and ${formSubmission.usia} < 30 then '20-29'
                when ${formSubmission.usia} >= 30 and ${formSubmission.usia} < 40 then '30-39'
                when ${formSubmission.usia} >= 40 and ${formSubmission.usia} < 50 then '40-49'
                when ${formSubmission.usia} >= 50 then '50+'
                else 'Tidak Diketahui'
            end
        `);

    return results.map((r) => ({
        ageRange: r.ageRange,
        count: Number(r.count),
    }));
}

/**
 * Kepemilikan e-KTP
 */
export async function getEKTPOwnership() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            status: formSubmission.statusKepemilikanEKTP,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.statusKepemilikanEKTP);

    return results.map((r) => ({
        status: r.status || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Jaminan sosial
 */
export async function getSocialSecurityDistribution() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            type: formSubmission.jenisJaminanSosial,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.jenisJaminanSosial);

    return results.map((r) => ({
        type: r.type || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Status pekerjaan
 */
export async function getEmploymentStatus() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            status: formSubmission.statusPekerjaan,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.statusPekerjaan);

    return results.map((r) => ({
        status: r.status || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Jenis pekerjaan
 */
export async function getJobTypes() {
    const results = await db
        .select({
            jobType: formSubmission.jenisPekerjaan,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(
            sql`${formSubmission.status} IN ('verified', 'submitted')
            and ${formSubmission.jenisPekerjaan} is not null
            and ${formSubmission.statusPekerjaan} = 'Bekerja'`,
        )
        .groupBy(formSubmission.jenisPekerjaan);

    return results.map((r) => ({
        jobType: r.jobType || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Partisipasi pelatihan
 */
export async function getTrainingParticipation() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            participated: formSubmission.pernahPelatihanKeterampilan,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.pernahPelatihanKeterampilan);

    return results.map((r) => ({
        participated: r.participated ? "Pernah" : "Belum Pernah",
        count: Number(r.count),
    }));
}

/**
 * Jenis pelatihan yang paling umum diikuti
 */
export async function getMostCommonTraining() {
    const submissions = await db
        .select({
            trainings: formSubmission.jenisPelatihanDiikuti,
        })
        .from(formSubmission)
        .where(
            sql`${formSubmission.status} IN ('verified', 'submitted')
            and ${formSubmission.jenisPelatihanDiikuti} is not null`,
        );

    // Parse JSON arrays dan hitung frekuensi
    const trainingCount: Record<string, number> = {};

    submissions.forEach((sub) => {
        if (sub.trainings) {
            try {
                const trainings = JSON.parse(sub.trainings as string);
                if (Array.isArray(trainings)) {
                    trainings.forEach((training) => {
                        trainingCount[training] =
                            (trainingCount[training] || 0) + 1;
                    });
                }
            } catch {
                // Skip invalid JSON
            }
        }
    });

    return Object.entries(trainingCount)
        .map(([training, count]) => ({ training, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Pelatihan yang diinginkan
 */
export async function getRequestedTraining() {
    const submissions = await db
        .select({
            trainings: formSubmission.pelatihanDiinginkan,
        })
        .from(formSubmission)
        .where(
            sql`${formSubmission.status} IN ('verified', 'submitted')
            and ${formSubmission.pelatihanDiinginkan} is not null`,
        );

    // Parse JSON arrays dan hitung frekuensi
    const trainingCount: Record<string, number> = {};

    submissions.forEach((sub) => {
        if (sub.trainings) {
            try {
                const trainings = JSON.parse(sub.trainings as string);
                if (Array.isArray(trainings)) {
                    trainings.forEach((training) => {
                        trainingCount[training] =
                            (trainingCount[training] || 0) + 1;
                    });
                }
            } catch {
                // Skip invalid JSON
            }
        }
    });

    return Object.entries(trainingCount)
        .map(([training, count]) => ({ training, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Akses layanan kesehatan
 */
export async function getHealthcareAccess() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            access: formSubmission.aksesLayananKesehatan,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.aksesLayananKesehatan);

    return results.map((r) => ({
        access: r.access || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Penyakit kronis
 */
export async function getChronicIllness() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            hasIllness: formSubmission.adaPenyakitKronis,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.adaPenyakitKronis);

    return results.map((r) => ({
        hasIllness: r.hasIllness ? "Ada Penyakit Kronis" : "Tidak Ada",
        count: Number(r.count),
    }));
}

/**
 * Pengalaman diskriminasi
 */
export async function getDiscriminationExperience() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            experienced: formSubmission.pernahDiskriminasi,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.pernahDiskriminasi);

    return results.map((r) => ({
        experienced: r.experienced || "Tidak Diketahui",
        count: Number(r.count),
    }));
}

/**
 * Jenis diskriminasi (untuk stacked bar)
 */
export async function getDiscriminationTypes() {
    const submissions = await db
        .select({
            types: formSubmission.jenisDiskriminasi,
        })
        .from(formSubmission)
        .where(
            sql`${formSubmission.status} IN ('verified', 'submitted')
            and ${formSubmission.jenisDiskriminasi} is not null
            and ${formSubmission.pernahDiskriminasi} = 'Pernah mengalami'`,
        );

    // Parse JSON arrays dan hitung frekuensi
    const typeCount: Record<string, number> = {};

    submissions.forEach((sub) => {
        if (sub.types) {
            try {
                const types = JSON.parse(sub.types as string);
                if (Array.isArray(types)) {
                    types.forEach((type) => {
                        typeCount[type] = (typeCount[type] || 0) + 1;
                    });
                }
            } catch {
                // Skip invalid JSON
            }
        }
    });

    return Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Penerima bantuan sosial
 */
export async function getSocialAidRecipients() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            receives: formSubmission.menerimaBantuanSosial,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.menerimaBantuanSosial);

    return results.map((r) => ({
        receives: r.receives ? "Menerima" : "Tidak Menerima",
        count: Number(r.count),
    }));
}

/**
 * Pendaftaran DTKS
 */
export async function getDTKSEnrollment() {
    const validStatuses = ["verified", "submitted"];

    const results = await db
        .select({
            enrolled: formSubmission.terdaftarDTKS,
            count: sql<number>`count(*)`,
        })
        .from(formSubmission)
        .where(inArray(formSubmission.status, validStatuses))
        .groupBy(formSubmission.terdaftarDTKS);

    return results.map((r) => ({
        enrolled: r.enrolled ? "Terdaftar" : "Tidak Terdaftar",
        count: Number(r.count),
    }));
}
