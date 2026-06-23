"use client";

import { useSearchParams } from "next/navigation";
import { CarGrid } from "@/components/cars/car-grid";
import { FleetFilters } from "@/components/fleet/fleet-filters";
import type { Car, FilterMeta } from "@/lib/types";

function applyFilters(cars: Car[], params: URLSearchParams): Car[] {
  const search = params.get("search") || "";
  const make = params.get("make") || "";
  const body_type = params.get("body_type") || "";
  const year = params.get("year") || "";
  const min_price = params.get("min_price") || "";
  const max_price = params.get("max_price") || "";
  const include_sold = params.get("include_sold") === "true";

  let results = [...cars];

  if (!include_sold) results = results.filter((c) => c.status === "available");
  if (make) results = results.filter((c) => c.make === make);
  if (body_type) results = results.filter((c) => c.body_type === body_type);
  if (year) results = results.filter((c) => c.year === Number(year));
  if (min_price) results = results.filter((c) => c.price >= Number(min_price));
  if (max_price) results = results.filter((c) => c.price <= Number(max_price));

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  return results;
}

export function FleetView({ cars, meta }: { cars: Car[]; meta: FilterMeta }) {
  const searchParams = useSearchParams();
  const filtered = applyFilters(cars, searchParams);

  return (
    <>
      <FleetFilters meta={meta} />
      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-white">{filtered.length}</span> vehicles available
        </p>
      </div>
      <div className="mt-8">
        <CarGrid cars={filtered} />
      </div>
    </>
  );
}
