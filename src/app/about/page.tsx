import Link from "next/link";
import { Crown, MapPin, Phone, Shield, Zap } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/cars";

export const metadata = { title: "About" };

export default function AboutPage() {
  const settings = getSettings();

  return (
    <main className="min-h-screen bg-background">
      <Header companyName={settings.company_name} />
      <PageHero eyebrow="About Us" title={settings.company_name} lead={settings.about_text} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">Who we are</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{settings.about_text}</p>
              <p className="mt-4 text-muted-foreground">
                Whether you need a stretch limousine for a wedding, an executive sedan for business travel, or a premium SUV for a special occasion, our team ensures every detail is handled with care.
              </p>
            </div>

            <Card className="border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8 lg:col-span-5">
              <h3 className="font-display text-xl font-semibold text-white">At a glance</h3>
              <ul className="mt-6 space-y-5">
                {[
                  { icon: MapPin, label: "Location", value: settings.location },
                  { icon: Phone, label: "Phone", value: settings.phone },
                  { icon: Crown, label: "Email", value: settings.email },
                  { icon: Zap, label: "Support", value: "WhatsApp 24/7" },
                ].map((item) => (
                  <li key={item.label} className="flex gap-4">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full">
                <Link href="/contact">Contact us</Link>
              </Button>
            </Card>
          </div>

          <div className="mt-20">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-gold">Our promise</p>
            <h2 className="font-display mt-4 text-center text-3xl font-semibold text-white md:text-4xl">
              What you can expect
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { icon: Shield, title: "Quality assured", desc: "Every vehicle inspected and maintained to premium standards." },
                { icon: Crown, title: "Luxury experience", desc: "From booking to drop-off, white-glove service at every step." },
                { icon: Zap, title: "Instant support", desc: "Reach us on WhatsApp anytime — fast responses, real humans." },
              ].map((item) => (
                <Card key={item.title} className="border-white/8 p-8 text-center">
                  <item.icon className="mx-auto h-8 w-8 text-gold" />
                  <h3 className="font-display mt-5 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
