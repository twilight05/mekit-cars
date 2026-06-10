import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Mekit Car Rentals",
    template: "%s | Mekit Car Rentals",
  },
  description:
    "Premium vehicle hire in Nigeria. Executive transport for weddings, events, corporate travel, and daily rentals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${playfair.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
