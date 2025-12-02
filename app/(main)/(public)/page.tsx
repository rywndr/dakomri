import { DukunganSection } from "@/components/home/dukungan-section";
import { HeroSection } from "@/components/home/hero-section";
import { KomitmenSection } from "@/components/home/komitmen-section";
import { TentangSection } from "@/components/home/tentang-section";
import { TujuanSection } from "@/components/home/tujuan-section";

export default function Home() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <TujuanSection />
            <TentangSection />
            <KomitmenSection />
            <DukunganSection />
        </div>
    );
}
