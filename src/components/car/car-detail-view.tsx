"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, Fuel, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { carImage, formatPrice, imageUrl } from "@/lib/images";
import { inquiryMessage, openWhatsApp, rentCarMessage } from "@/lib/whatsapp";
import type { Car } from "@/lib/types";

export function CarDetailView({ car }: { car: Car }) {
  const imgs = car.images.length
    ? car.images.map((src) => imageUrl(src, car.body_type))
    : [carImage(car)];
  const [activeImg, setActiveImg] = useState(0);
  const [alert, setAlert] = useState<string | null>(null);
  const sold = car.status === "sold";

  function handleRent() {
    openWhatsApp(rentCarMessage(car));
  }

  function handleInquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    openWhatsApp(
      inquiryMessage(car, {
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        dates: String(fd.get("dates") || ""),
        message: String(fd.get("message") || ""),
      })
    );
    setAlert("Your message is ready — tap send in WhatsApp.");
    e.currentTarget.reset();
  }

  const specs = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Year", value: car.year },
    { label: "Body", value: car.body_type },
    { label: "Status", value: sold ? "Sold" : "Available" },
    ...(car.mileage ? [{ label: "Mileage", value: `${car.mileage.toLocaleString()} km` }] : []),
    ...(car.fuel ? [{ label: "Fuel", value: car.fuel }] : []),
    ...(car.transmission ? [{ label: "Transmission", value: car.transmission }] : []),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <Link
          href="/fleet"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to showroom
        </Link>

        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/8">
          {sold && <Badge variant="sold" className="absolute left-4 top-4 z-10">Sold</Badge>}
          <Image
            src={imgs[activeImg]}
            alt={car.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        {imgs.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {imgs.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-all ${
                  i === activeImg ? "border-gold ring-2 ring-gold/30" : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          {car.body_type} · {car.year}
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-white md:text-5xl">{car.title}</h1>
        <p className="font-display mt-4 text-4xl font-semibold text-gold">{formatPrice(car.price)}</p>
        <p className="mt-1 text-sm text-muted-foreground">per day · transparent pricing</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" disabled={sold} onClick={handleRent} className="flex-1 sm:flex-none">
            {sold ? "Unavailable" : "Rent Now via WhatsApp"}
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: "Flexible dates" },
            { icon: Fuel, label: car.fuel || "Premium" },
            { icon: Gauge, label: car.transmission || "Auto" },
          ].map((item) => (
            <Card key={item.label} className="border-white/8 p-4 text-center">
              <item.icon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-white/8 p-6">
          <h2 className="font-display text-xl font-semibold text-white">Specifications</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 text-sm font-medium text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {car.description && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-white">Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{car.description}</p>
          </div>
        )}

        <Card className="mt-8 border-gold/20 bg-gold/5 p-6">
          <h2 className="font-display text-xl font-semibold text-white">Request this vehicle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details and we&apos;ll open WhatsApp with your inquiry pre-filled.
          </p>
          {alert && (
            <p className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {alert}
            </p>
          )}
          <form onSubmit={handleInquiry} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required className="mt-2" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="08012345678" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="dates">Preferred dates</Label>
              <Input id="dates" name="dates" placeholder="e.g. 15–18 June 2026" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Tell us about your event or trip…" className="mt-2" />
            </div>
            <Button type="submit" className="w-full" disabled={sold}>
              Send via WhatsApp
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
