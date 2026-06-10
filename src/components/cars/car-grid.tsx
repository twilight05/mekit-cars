import { CarCard } from "./car-card";
import type { Car } from "@/lib/types";

export function CarGrid({ cars }: { cars: Car[] }) {
  if (!cars.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-20 text-center">
        <p className="font-display text-xl text-white">No vehicles found</p>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
