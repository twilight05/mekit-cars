import { SITE } from "@/config/site";
import type { Car } from "@/lib/types";
import { formatPrice } from "@/lib/images";

function formatWhatsAppNumber(num: string) {
  let digits = num.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "234" + digits.slice(1);
  if (digits.length === 10 && digits.startsWith("8")) digits = "234" + digits;
  return digits;
}

export function whatsappUrl(text: string, number = SITE.whatsappNumber) {
  const digits = formatWhatsAppNumber(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(text: string) {
  window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
}

function carListingUrl(carId: number) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/car/${carId}`;
  }
  return `/car/${carId}`;
}

function formatCarDetails(car: Car, listingUrl?: string) {
  const lines = [
    `🚗 *${car.title}*`,
    "",
    `*Make:* ${car.make}`,
    `*Model:* ${car.model}`,
    `*Year:* ${car.year}`,
    `*Body type:* ${car.body_type}`,
    `*Price:* ${formatPrice(car.price)}`,
    `*Status:* ${car.status === "sold" ? "Sold" : "Available"}`,
  ];
  if (car.mileage) lines.push(`*Mileage:* ${car.mileage.toLocaleString()} km`);
  if (car.fuel) lines.push(`*Fuel:* ${car.fuel}`);
  if (car.transmission) lines.push(`*Transmission:* ${car.transmission}`);
  if (car.description?.trim()) lines.push("", `*Description:*`, car.description.trim());
  if (listingUrl) lines.push("", `*View listing:* ${listingUrl}`);
  return lines.join("\n");
}

export function rentCarMessage(car: Car) {
  return [
    `🚗 *Rent request — ${SITE.companyName}*`,
    "",
    formatCarDetails(car, carListingUrl(car.id)),
    "",
    "_Customer wants to rent this vehicle from your website._",
  ].join("\n");
}

export function inquiryMessage(
  car: Car,
  details: { name: string; phone: string; dates?: string; message?: string }
) {
  const lines = [
    `📩 *New booking inquiry — ${SITE.companyName}*`,
    "",
    formatCarDetails(car, carListingUrl(car.id)),
    "",
    "— *Customer details* —",
    `*Name:* ${details.name.trim()}`,
    `*Phone:* ${details.phone.trim()}`,
  ];
  if (details.dates?.trim()) lines.push(`*Dates / duration:* ${details.dates.trim()}`);
  if (details.message?.trim()) lines.push(`*Message:* ${details.message.trim()}`);
  lines.push("", "_Sent via website inquiry form_");
  return lines.join("\n");
}

export function contactMessage(details: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
}) {
  const lines = [
    `📬 *Contact form — ${SITE.companyName}*`,
    "",
    `*Name:* ${details.name.trim()}`,
    `*Phone:* ${details.phone.trim()}`,
  ];
  if (details.email?.trim()) lines.push(`*Email:* ${details.email.trim()}`);
  if (details.subject?.trim()) lines.push(`*Subject:* ${details.subject.trim()}`);
  if (details.message?.trim()) lines.push("", `*Message:*`, details.message.trim());
  lines.push("", "_Sent via website contact page_");
  return lines.join("\n");
}
