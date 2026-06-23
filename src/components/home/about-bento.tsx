import Image from "next/image";
import Link from "next/link";
import { Crown, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Settings } from "@/lib/types";

export function AboutBento({ settings }: { settings: Settings }) {
  return (
    <section className="relative border-y border-white/8 bg-[#080808] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
          <Card className="relative overflow-hidden border-white/8 lg:col-span-7 lg:row-span-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              <Image
                src="/images/hero.jpg"
                alt="Mekit premium fleet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">About Us</p>
                <h2 className="font-display mt-3 text-3xl font-semibold text-white md:text-4xl">
                  Houston&apos;s trusted luxury transportation experience
                </h2>
              </div>
            </div>
          </Card>

          <Card className="border-white/8 bg-gradient-to-br from-gold/10 to-transparent p-8 lg:col-span-5">
            <Crown className="h-8 w-8 text-gold" />
            <h3 className="font-display mt-6 text-2xl font-semibold text-white">Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To become one of the most trusted and recognized luxury transportation providers in Texas, delivering world-class travel experiences that make every ride memorable.
            </p>
          </Card>

          <Card className="border-white/8 p-8 lg:col-span-5">
            <Zap className="h-8 w-8 text-gold" />
            <h3 className="font-display mt-6 text-2xl font-semibold text-white">Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {settings.about_text ||
                "To provide premium, dependable, and affordable luxury transportation solutions while creating lasting relationships with our clients through excellence and outstanding service."}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/about">Learn more</Link>
            </Button>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Fully Inspected",
              desc: "Every vehicle maintained to executive standards before each hire.",
            },
            {
              icon: Crown,
              title: "White-Glove Service",
              desc: "Weddings, corporate events, airport transfers — handled with care.",
            },
            {
              icon: Zap,
              title: "Instant Booking",
              desc: "Select a vehicle and confirm your rental on WhatsApp in seconds.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-white/8 p-8 transition-colors hover:border-gold/20">
              <item.icon className="h-6 w-6 text-gold" />
              <h3 className="font-display mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
