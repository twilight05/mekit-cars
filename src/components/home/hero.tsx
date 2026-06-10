import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import type { Settings } from "@/lib/types";

export function Hero({ settings }: { settings: Settings }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Premium black luxury sedan"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="hero-gradient absolute inset-0" />
      <div className="grid-pattern absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,169,98,0.12),transparent_50%)]" />

      <Header companyName={settings.company_name} transparent />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-32 lg:px-8 lg:pb-32">
        <div className="max-w-4xl">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Fleet · Nigeria
          </div>

          <h1 className="animate-fade-up animate-delay-1 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            Drive the
            <span className="block bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Extraordinary
            </span>
          </h1>

          <p className="animate-fade-up animate-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            {settings.hero_text ||
              "Premium vehicles for weddings, events, corporate travel, and daily hire across Nigeria."}
          </p>

          <div className="animate-fade-up animate-delay-3 mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/fleet">
                Explore Showroom
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up animate-delay-4 mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 md:grid-cols-4 md:gap-8">
          {[
            { value: "50+", label: "Premium Vehicles" },
            { value: "24/7", label: "WhatsApp Support" },
            { value: "100%", label: "Inspected Fleet" },
            { value: "5★", label: "Client Experience" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-gold md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
