import Link from "next/link"
import { site } from "@/lib/site"

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "La maison" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="px-5 pb-10 pt-20 md:px-12 md:pt-28">
        <p className="font-serif uppercase leading-[0.78] tracking-[0.04em]">
          <span className="block text-[clamp(3.2rem,17vw,11rem)]">Moluki</span>
          <span className="mt-3 block text-[clamp(1rem,3.2vw,2.4rem)] tracking-[0.34em]">Alembakate</span>
        </p>
        <nav className="mt-16 flex flex-col gap-3" aria-label="Pied de page">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="font-serif text-4xl leading-none transition-colors hover:text-metal md:text-5xl">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-ivory/70">
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-ivory">
              Instagram
            </a>
          ) : (
            <span>Instagram</span>
          )}
          <Link href="/contact" className="hover:text-ivory">
            Écrire
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-6 text-[11px] uppercase tracking-[0.16em] text-ivory/50 md:flex-row md:justify-between md:px-12">
        <p>© {new Date().getFullYear()} Moluki Alembakate</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/conditions">Conditions</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cart">Panier</Link>
          <Link href="/admin">Atelier</Link>
        </div>
      </div>
    </footer>
  )
}
