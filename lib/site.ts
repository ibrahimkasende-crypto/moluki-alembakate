export const site = {
  name: "Moluki Alembakate",
  wordmark: ["MOLUKI", "ALEMBAKATE"] as const,
  tagline: "L'élégance en mouvement.",
  description:
    "Moluki Alembakate, maison de vêtements masculine. Chemises, polos, complets, pantalons et tee-shirts, entre caractère, élégance et simplicité.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "atelier@molukialembakate.com",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
}

export const nav = [
  { href: "/shop", label: "Boutique" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "La maison" },
  { href: "/contact", label: "Contact" },
] as const

export function whatsappHref(message: string) {
  if (!site.whatsapp) return null
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
