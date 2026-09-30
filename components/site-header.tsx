"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/components/cart-provider"
import { MobileMenu } from "@/components/mobile-menu"
import { SearchDialog } from "@/components/search-dialog"
import { Wordmark } from "@/components/wordmark"
import { nav } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const { count, ready } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const [searchPath, setSearchPath] = useState<string | null>(null)
  const [cart, setCart] = useState(false)
  const quiet = pathname.startsWith("/checkout")
  const menu = menuPath === pathname
  const search = searchPath === pathname
  const light = (pathname === "/" || pathname === "/lookbook") && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500",
          light
            ? "border-transparent bg-transparent text-ivory"
            : scrolled
              ? "border-line bg-ivory/95 text-ink backdrop-blur-md"
              : "border-transparent bg-ivory/80 text-ink backdrop-blur-md",
        )}
      >
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
          {quiet ? (
            <Link href="/cart" className="text-[11px] uppercase tracking-[0.18em]">
              Panier
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <button type="button" className="md:hidden" aria-label="Ouvrir le menu" aria-expanded={menu} onClick={() => setMenuPath(pathname)}>
                <Menu size={20} strokeWidth={1.25} />
              </button>
              <nav className="hidden items-center gap-6 md:flex" aria-label="Principale">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-link text-[11px] uppercase tracking-[0.18em] hover:text-wine",
                      pathname.startsWith(item.href) ? "text-wine" : light ? "text-ivory" : "text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
          <Link href="/" aria-label="Moluki Alembakate, accueil" className="justify-self-center">
            <Wordmark compact tone={light ? "ivory" : "wine"} />
          </Link>
          <div className="flex items-center justify-end gap-1">
            {!quiet ? (
              <button type="button" className="grid h-11 w-11 place-items-center" aria-label="Rechercher" onClick={() => setSearchPath(pathname)}>
                <Search size={18} strokeWidth={1.25} />
              </button>
            ) : null}
            <button type="button" className="relative grid h-11 w-11 place-items-center" aria-label="Ouvrir le panier" onClick={() => setCart(true)}>
              <ShoppingBag size={18} strokeWidth={1.25} />
              {ready && count > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-wine px-1 text-[9px] text-ivory">{count}</span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenuPath(null)} />
      <SearchDialog open={search} onClose={() => setSearchPath(null)} />
      <CartDrawer open={cart} onClose={() => setCart(false)} />
    </>
  )
}
