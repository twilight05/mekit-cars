import { Suspense } from "react";
import { FleetView } from "@/components/fleet/fleet-view";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { getCars, getFilterMeta, getSettings } from "@/lib/cars";

export const metadata = { title: "Showroom" };

export default function FleetPage() {
  const settings = getSettings();
  const cars = getCars({ include_sold: "true" });
  const meta = getFilterMeta();

  return (
    <main className="min-h-screen bg-background">
      <Header companyName={settings.company_name} />
      <PageHero
        eyebrow="Showroom"
        title="Find your ideal ride"
        lead="Filter our curated fleet and book instantly via WhatsApp."
      />
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Suspense fallback={<p className="text-muted-foreground">Loading vehicles…</p>}>
            <FleetView cars={cars} meta={meta} />
          </Suspense>
        </div>
      </section>
      <Footer settings={settings} />
    </main>
  );
}
