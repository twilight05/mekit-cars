export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

const FLEET_IMAGES: Record<string, string> = {
  Limo: "/images/fleet/limo.jpg",
  Sedan: "/images/fleet/sedan.jpg",
  SUV: "/images/fleet/suv.jpg",
  Truck: "/images/fleet/truck.jpg",
};

export function formatPrice(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

export function fleetImage(bodyType?: string) {
  return FLEET_IMAGES[bodyType || ""] || "/images/fleet/sedan.jpg";
}

export function imageUrl(path?: string | null, bodyType?: string) {
  if (!path) return fleetImage(bodyType);
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `/${path.replace(/^\//, "")}`;
}

export function carImage(car: { images?: string[]; body_type?: string }) {
  const first = car.images?.[0];
  if (first && !first.includes("placeholder") && !first.includes("hero.png")) {
    return imageUrl(first, car.body_type);
  }
  return fleetImage(car.body_type);
}
