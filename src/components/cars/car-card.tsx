"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { carImage, formatPrice, PLACEHOLDER_IMAGE } from "@/lib/images";
import { openWhatsApp, rentCarMessage } from "@/lib/whatsapp";
import type { Car } from "@/lib/types";

export function CarCard({ car }: { car: Car }) {
  const sold = car.status === "sold";
  const spec = [car.fuel, car.transmission].filter(Boolean).join(" · ") || `${car.body_type} · ${car.year}`;

  function handleRent(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openWhatsApp(rentCarMessage(car));
  }

  return (
    <Card className="group overflow-hidden border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,169,98,0.12)]">
      <Link href={`/car/${car.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {sold && (
            <Badge variant="sold" className="absolute left-4 top-4 z-10">
              Sold
            </Badge>
          )}
          <Image
            src={carImage(car)}
            alt={car.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <Badge>{car.body_type}</Badge>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-gold">
                {car.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{spec}</p>
            </div>
            <button
              type="button"
              className="text-white/30 transition-colors hover:text-gold"
              aria-label="Save vehicle"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">From</p>
              <p className="font-display text-2xl font-semibold text-gold">{formatPrice(car.price)}</p>
            </div>
            <span className="text-xs text-muted-foreground">per day</span>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <Button className="w-full" disabled={sold} onClick={handleRent}>
          {sold ? "Unavailable" : "Rent Now"}
        </Button>
      </div>
    </Card>
  );
}
