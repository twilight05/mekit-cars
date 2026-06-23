import Link from "next/link";
import { Briefcase, Clock, Crown, Gem, Heart, MapPin, Phone, Shield, Star, Zap } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/cars";

export const metadata = { title: "About" };

const CORE_VALUES = [
  { icon: Briefcase, title: "Professionalism" },
  { icon: Shield, title: "Safety" },
  { icon: Clock, title: "Reliability" },
  { icon: Gem, title: "Luxury" },
  { icon: Heart, title: "Integrity" },
  { icon: Star, title: "Exceptional Customer Service" },
];

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
                At Mekit Happen Luxury Ryde, we specialize in executive and luxury transportation services for business professionals, corporate clients, airport transfers, private events, special occasions, and discerning travelers who value excellence. Our flagship luxury vehicles are carefully selected to deliver elegance, comfort, and a first-class riding experience.
              </p>
              <p className="mt-4 text-muted-foreground">
                Our mission is to redefine local transportation by combining luxury, punctuality, exceptional customer service, and personalized attention to every client. Whether you&apos;re traveling to an important business meeting, heading to the airport, attending a wedding, entertaining VIP guests, or simply seeking a premium ride experience, Mekit Happen Luxury Ryde is committed to exceeding your expectations.
              </p>
              <p className="mt-4 text-muted-foreground">
                We understand that our clients value their time, privacy, and comfort. That&apos;s why every ride is delivered with professionalism, discretion, and attention to detail. Our goal is to become the preferred luxury transportation brand in Texas, known for reliability, excellence, and unforgettable customer experiences.
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
            <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-gold">What drives us</p>
            <h2 className="font-display mt-4 text-center text-3xl font-semibold text-white md:text-4xl">Our Core Values</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {CORE_VALUES.map((item) => (
                <Card key={item.title} className="border-white/8 p-6 text-center">
                  <item.icon className="mx-auto h-8 w-8 text-gold" />
                  <h3 className="font-display mt-4 text-lg font-semibold text-white">{item.title}</h3>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-2">
            <Card className="border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8">
              <Crown className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-6 text-2xl font-semibold text-white">Our Vision</h3>
              <p className="mt-3 text-muted-foreground">
                To become one of the most trusted and recognized luxury transportation providers in Texas, delivering world-class travel experiences that make every ride memorable.
              </p>
            </Card>
            <Card className="border-white/8 p-8">
              <Zap className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-6 text-2xl font-semibold text-white">Our Mission</h3>
              <p className="mt-3 text-muted-foreground">
                To provide premium, dependable, and affordable luxury transportation solutions while creating lasting relationships with our clients through excellence and outstanding service.
              </p>
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
