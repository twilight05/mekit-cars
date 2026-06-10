import { SITE } from "@/config/site";
import { CARS } from "@/data/cars";
import type { Car, FilterMeta } from "@/lib/types";

export function getSettings() {
  return {
    company_name: SITE.companyName,
    tagline: SITE.tagline,
    whatsapp_number: SITE.whatsappNumber,
    phone: SITE.phone,
    email: SITE.email,
    location: SITE.location,
    hero_text: SITE.heroText,
    about_text: SITE.aboutText,
  };
}

export function getCars(params: Record<string, string | number | boolean> = {}): Car[] {
  const {
    search = "",
    make = "",
    body_type = "",
    min_price = "",
    max_price = "",
    year = "",
    include_sold = "false",
    limit = "",
  } = params;

  let results = [...CARS];

  if (include_sold !== "true" && include_sold !== true) {
    results = results.filter((c) => c.status === "available");
  }

  if (make) results = results.filter((c) => c.make === make);
  if (body_type) results = results.filter((c) => c.body_type === body_type);
  if (year) results = results.filter((c) => c.year === Number(year));
  if (min_price) results = results.filter((c) => c.price >= Number(min_price));
  if (max_price) results = results.filter((c) => c.price <= Number(max_price));

  if (String(search).trim()) {
    const q = String(search).trim().toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  if (limit) results = results.slice(0, Number(limit));
  return results;
}

export function getCar(id: string | number): Car | undefined {
  return CARS.find((c) => c.id === Number(id));
}

export function getFilterMeta(): FilterMeta {
  const makes = [...new Set(CARS.map((c) => c.make))].sort();
  const bodyTypes = [...new Set(CARS.map((c) => c.body_type))].sort();
  const years = [...new Set(CARS.map((c) => c.year))].sort((a, b) => b - a);
  const prices = CARS.map((c) => c.price);
  const available = CARS.filter((c) => c.status === "available").length;

  return {
    makes,
    bodyTypes,
    years,
    min_price: Math.min(...prices),
    max_price: Math.max(...prices),
    total: CARS.length,
    available,
  };
}
