import { notFound } from "next/navigation";
import { CarDetailView } from "@/components/car/car-detail-view";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCar, getSettings } from "@/lib/cars";
import { CARS } from "@/data/cars";

export function generateStaticParams() {
  return CARS.map((car) => ({ id: String(car.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCar(id);
  return { title: car?.title ?? "Vehicle" };
}

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCar(id);
  if (!car) notFound();

  const settings = getSettings();

  return (
    <main className="min-h-screen bg-background">
      <Header companyName={settings.company_name} />
      <section className="pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <CarDetailView car={car} />
        </div>
      </section>
      <Footer settings={settings} />
    </main>
  );
}
