import Link from "next/link";
import { ArrowRight, Briefcase, Car, Plane, Truck, Heart } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/cars";

export const metadata = { title: "Services" };

const SERVICES = [
  { icon: Heart, title: "Wedding & events", desc: "Stretch limousines, luxury sedans, and SUVs for weddings, anniversaries, and red-carpet occasions.", href: "/fleet?body_type=Limo" },
  { icon: Briefcase, title: "Corporate travel", desc: "Executive sedans and premium SUVs for business meetings, client pickups, and airport transfers.", href: "/fleet?body_type=Sedan" },
  { icon: Plane, title: "Airport transfers", desc: "Comfortable pickups and drop-offs. Share your flight details via WhatsApp and we'll handle the rest.", href: "/contact" },
  { icon: Car, title: "Daily & weekly hire", desc: "Flexible short-term and long-term rentals with transparent daily rates on every listing.", href: "/fleet" },
  { icon: Truck, title: "Logistics & cargo", desc: "Pickup trucks and vans for construction, deliveries, and site visits.", href: "/fleet?body_type=Truck" },
];

export default function ServicesPage() {
  const settings = getSettings();

  return (
    <main className="min-h-screen bg-background">
      <Header companyName={settings.company_name} />
      <PageHero
        eyebrow="Services"
        title="Transport for every occasion"
        lead="From weddings and corporate events to airport transfers and daily hire — the right vehicle for your needs."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card
                key={service.title}
                className="group border-white/8 p-8 transition-all hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,169,98,0.08)]"
              >
                <service.icon className="h-8 w-8 text-gold" />
                <h3 className="font-display mt-6 text-2xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-light"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
