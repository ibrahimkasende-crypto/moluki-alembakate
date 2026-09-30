"use client"

import Link from "next/link"
import { FadeIn, TextReveal } from "@/components/motion"
import { site } from "@/lib/site"

const links = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "La maison" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="px-5 pb-16 pt-20 md:px-12 md:pb-24 md:pt-28">
        <TextReveal text="Moluki" className="font-serif text-[clamp(4.2rem,16vw,11rem)] uppercase leading-[0.8]" />
        <FadeIn delay={0.12}>
          <p className="mt-3 text-[12px] uppercase tracking-[0.42em] text-ivory/55 md:text-sm">Alembakate</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <nav className="mt-14 flex flex-col gap-3 md:mt-20" aria-label="Pied de page">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link w-fit text-sm text-ivory/80">
                {item.label}
              </Link>
            ))}
          </nav>
        </FadeIn>
        <FadeIn delay={0.28}>
          <div className="mt-12 flex flex-col gap-3 text-sm text-ivory/70">
            {site.instagram ? (
              <a href={site.instagram} target="_blank" rel="noreferrer" className="nav-link w-fit">
                Instagram
              </a>
            ) : null}
            <a href={`mailto:${site.email}`} className="nav-link w-fit">
              {site.email}
            </a>
          </div>
        </FadeIn>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-6 text-[11px] uppercase tracking-[0.16em] text-ivory/45 md:flex-row md:items-center md:justify-between md:px-12">
        <p>© {new Date().getFullYear()} Moluki Alembakate</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/conditions" className="nav-link">
            Conditions
          </Link>
          <Link href="/confidentialite" className="nav-link">
            Confidentialité
          </Link>
          <Link href="/cart" className="nav-link">
            Panier
          </Link>
          <Link href="/admin" className="nav-link inline-flex items-center" aria-label="Administration">
            <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
