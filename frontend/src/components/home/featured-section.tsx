import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarGrid } from "@/components/cars/car-grid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Car } from "@/lib/types";

export function FeaturedSection({ cars }: { cars: Car[] }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Curated Selection</p>
            <h2 className="font-display mt-4 text-4xl font-semibold text-white md:text-5xl">
              Featured from our showroom
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hand-picked luxury vehicles ready for your next occasion. Tap Rent Now to book instantly via WhatsApp.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/fleet">
              View all vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Separator className="my-12" />
        <CarGrid cars={cars} />
      </div>
    </section>
  );
}
