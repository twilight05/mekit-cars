"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Showroom" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  companyName = "Mekit Car Rentals",
  transparent = false,
}: {
  companyName?: string;
  transparent?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !transparent;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-white/8 bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold transition-colors group-hover:border-gold group-hover:bg-gold/20">
            M
          </span>
          <div className="leading-tight">
            <span className="font-display text-lg font-semibold text-white">Mekit</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
              Car Rentals
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-gold"
                  : "text-white/70 hover:text-white"
              )}
            >
              {item.label}
              {(pathname === item.href || pathname.startsWith(item.href + "/")) && (
                <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href="/contact">Book Now</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/8 bg-black/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === item.href ? "bg-gold/10 text-gold" : "text-white/80"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-4 w-full">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
