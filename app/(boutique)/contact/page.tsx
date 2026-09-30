import type { Metadata } from "next"
import { CampaignImage } from "@/components/campaign-image"
import { ContactForm } from "@/components/contact-form"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à Moluki Alembakate.",
}

export default function ContactPage() {
  return (
    <div className="md:grid md:min-h-[100svh] md:grid-cols-12">
      <CampaignImage id="campaign-bordeaux" priority sizes="(min-width: 768px) 58vw, 100vw" className="h-[62vh] md:col-span-7 md:h-auto md:min-h-[100svh]" />
      <div className="flex flex-col justify-end px-5 py-16 md:col-span-5 md:px-14 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Contact</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] md:text-7xl">Écrire</h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">Une taille, une pièce, une commande. Le message reste à l&apos;atelier.</p>
        <div className="mt-12">
          <ContactForm />
        </div>
        <p className="mt-10 text-sm text-stone">{site.email}</p>
        {site.whatsapp ? <p className="mt-2 text-sm text-stone">WhatsApp +{site.whatsapp}</p> : null}
      </div>
    </div>
  )
}
