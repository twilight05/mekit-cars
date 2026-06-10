import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { Settings } from "@/lib/types";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Showroom" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings }: { settings?: Partial<Settings> }) {
  const year = new Date().getFullYear();
  const name = settings?.company_name || "Mekit Car Rentals";
  const phone = settings?.phone || "08139723327";
  const email = settings?.email || "info@mekitcarrentals.com";

  return (
    <footer className="relative border-t border-white/8 bg-[#050505]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-xl text-gold">
                M
              </span>
              <div>
                <p className="font-display text-2xl font-semibold text-white">Mekit</p>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Car Rentals</p>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings?.tagline ||
                "Premium vehicle hire for weddings, corporate events, and executive travel across Nigeria."}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Explore</p>
            <nav className="mt-5 flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <a href={`tel:${phone}`} className="transition-colors hover:text-gold">
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-gold">
                  {email}
                </a>
              </li>
              {settings?.location && <li>{settings.location}</li>}
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {name}. All rights reserved.</p>
          <p className="text-gold/60">Luxury in motion</p>
        </div>
      </div>
    </footer>
  );
}
