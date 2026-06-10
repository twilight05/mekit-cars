import { AboutBento } from "@/components/home/about-bento";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { Hero } from "@/components/home/hero";
import { Footer } from "@/components/layout/footer";
import { getCars, getSettings } from "@/lib/cars";

export default function HomePage() {
  const settings = getSettings();
  const cars = getCars({ limit: 6 });

  return (
    <main className="bg-background">
      <Hero settings={settings} />
      <FeaturedSection cars={cars} />
      <AboutBento settings={settings} />
      <CtaSection />
      <Footer settings={settings} />
    </main>
  );
}
