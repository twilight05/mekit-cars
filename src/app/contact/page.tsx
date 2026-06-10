import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/cars";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const settings = getSettings();

  return (
    <main className="min-h-screen bg-background">
      <Header companyName={settings.company_name} />
      <PageHero
        eyebrow="Contact"
        title="Let's plan your journey"
        lead="Reach our team — we respond quickly on WhatsApp."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <Card className="border-white/8 p-8 lg:col-span-7 lg:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">Send a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ll open WhatsApp with your message pre-filled — just tap send.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Card>

            <div className="space-y-6 lg:col-span-5">
              <Card className="border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8">
                <h3 className="font-display text-xl font-semibold text-white">Get in touch</h3>
                <ul className="mt-6 space-y-5">
                  {[
                    { icon: Phone, label: "Phone", value: settings.phone },
                    { icon: Mail, label: "Email", value: settings.email },
                    { icon: MapPin, label: "Location", value: settings.location },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-4">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="border-white/8 p-8">
                <h3 className="font-display text-lg font-semibold text-white">Business hours</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  WhatsApp support available 24/7. Office inquiries Mon–Sat, 9am–6pm WAT.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
