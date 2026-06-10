"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FilterMeta } from "@/lib/types";

export function FleetFilters({ meta }: { meta: FilterMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`/fleet?${params.toString()}`));
    },
    [router, searchParams]
  );

  function reset() {
    startTransition(() => router.push("/fleet"));
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-card/60 p-6 backdrop-blur-xl lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Refine</p>
      <h2 className="font-display mt-2 text-2xl font-semibold text-white">Find your ideal ride</h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-2 xl:col-span-3">
          <Label htmlFor="search">Search</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Make, model, or keyword"
              className="pl-10"
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => update("search", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="make">Make</Label>
          <select
            id="make"
            className="mt-2 flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            value={searchParams.get("make") || ""}
            onChange={(e) => update("make", e.target.value)}
          >
            <option value="">All makes</option>
            {meta.makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="body_type">Body type</Label>
          <select
            id="body_type"
            className="mt-2 flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            value={searchParams.get("body_type") || ""}
            onChange={(e) => update("body_type", e.target.value)}
          >
            <option value="">All types</option>
            {meta.bodyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <select
            id="year"
            className="mt-2 flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            value={searchParams.get("year") || ""}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="">Any year</option>
            {meta.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="min_price">Min price</Label>
          <Input
            id="min_price"
            type="number"
            placeholder="Minimum"
            className="mt-2"
            defaultValue={searchParams.get("min_price") || ""}
            onChange={(e) => update("min_price", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="max_price">Max price</Label>
          <Input
            id="max_price"
            type="number"
            placeholder="Maximum"
            className="mt-2"
            defaultValue={searchParams.get("max_price") || ""}
            onChange={(e) => update("max_price", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="rounded border-white/20 bg-white/5 accent-gold"
            checked={searchParams.get("include_sold") === "true"}
            onChange={(e) => update("include_sold", e.target.checked ? "true" : "")}
          />
          Include sold vehicles
        </label>
        <Button variant="ghost" size="sm" onClick={reset} disabled={pending}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
