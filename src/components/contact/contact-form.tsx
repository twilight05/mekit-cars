"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactMessage, openWhatsApp } from "@/lib/whatsapp";

export function ContactForm() {
  const [alert, setAlert] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    openWhatsApp(
      contactMessage({
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        email: String(fd.get("email") || ""),
        subject: String(fd.get("subject") || ""),
        message: String(fd.get("message") || ""),
      })
    );
    setAlert("Your message is ready — tap send in WhatsApp.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {alert && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {alert}
        </p>
      )}
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" required placeholder="08012345678" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Wedding booking, fleet inquiry…" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="Tell us what you need…" className="mt-2" />
      </div>
      <Button type="submit" className="w-full">
        Send via WhatsApp
      </Button>
    </form>
  );
}
