import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20">
          <div className="absolute inset-0">
            <Image src="/images/hero.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
          </div>
          <div className="relative grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Exclusive Offers</p>
              <h2 className="font-display mt-4 text-4xl font-semibold text-white md:text-5xl">
                Unlock premium deals for your next journey
              </h2>
              <ul className="mt-8 space-y-4 text-white/70">
                {[
                  "Up to 10% off weekly rentals",
                  "Complimentary chauffeur on select vehicles",
                  "Flexible installment plans available",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Button asChild size="lg">
                <Link href="/contact">Get Your Offer</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/fleet">Browse Fleet</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
