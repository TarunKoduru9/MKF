import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { StorySection } from "@/components/home/StorySection";
import { ProgramSection } from "@/components/home/ProgramSection";
import { OccasionsSection } from "@/components/home/OccasionsSection";
import { InvolvedSection } from "@/components/home/InvolvedSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <StorySection />
        <ProgramSection />
        <OccasionsSection />
        <InvolvedSection />
      </main>

      <Footer />
    </div>
  );
}
