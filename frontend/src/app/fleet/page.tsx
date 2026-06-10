import { Suspense } from "react";
import { CarGrid } from "@/components/cars/car-grid";
import { FleetFilters } from "@/components/fleet/fleet-filters";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { getCars, getFilterMeta, getSettings } from "@/lib/cars";

export const metadata = { title: "Showroom" };

async function FleetContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (typeof v === "string") query[k] = v;
  });

  const cars = getCars(query);
  const meta = getFilterMeta();

  return (
    <>
      <FleetFilters meta={meta} />
      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-white">{cars.length}</span> vehicles available
        </p>
      </div>
      <div className="mt-8">
        <CarGrid cars={cars} />
      </div>
    </>
  );
}

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const settings = getSettings();

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
            <FleetContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
      <Footer settings={settings} />
    </main>
  );
}
