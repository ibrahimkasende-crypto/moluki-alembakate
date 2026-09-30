"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const [bagPop, setBagPop] = useState(false)
  const previousCount = useRef(0)
  const bagReady = useRef(false)
  const quiet = pathname.startsWith("/checkout")
  const menu = menuPath === pathname
  const search = searchPath === pathname
  const light = pathname === "/" && !scrolled

  function goHome(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return
    event.preventDefault()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    if (window.location.hash) window.history.pushState(null, "", "/")
  }

  useEffect(() => {
    if (!ready) return
    if (!bagReady.current) {
      bagReady.current = true
      previousCount.current = count
      return
    }
    if (count > previousCount.current) {
      setBagPop(true)
      const timer = window.setTimeout(() => setBagPop(false), 450)
      previousCount.current = count
      return () => window.clearTimeout(timer)
    }
    previousCount.current = count
  }, [count, ready])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
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
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter,color] duration-700 ease-out",
          light
            ? "border-transparent bg-transparent text-ivory [text-shadow:0_1px_12px_rgb(17_17_16_/_0.45)]"
            : "border-line/80 bg-ivory/90 text-ink shadow-none backdrop-blur-md [text-shadow:none]",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:h-16 md:px-8">
          {quiet ? (
            <div className="flex items-center gap-4">
              <Link href="/" onClick={goHome} className="nav-link text-[11px] uppercase tracking-[0.18em]">
                Accueil
              </Link>
              <Link href="/cart" className="nav-link text-[11px] uppercase tracking-[0.18em]">
                Panier
              </Link>
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-4 md:gap-8">
              <button type="button" className="lg:hidden" aria-label="Ouvrir le menu" aria-expanded={menu} onClick={() => setMenuPath(pathname)}>
                <Menu size={20} strokeWidth={1.25} />
              </button>
              <Link href="/" aria-label="Moluki Alembakate, accueil" onClick={goHome} className="min-w-0 transition-opacity duration-500 hover:opacity-70">
                <Wordmark compact tone={light ? "ivory" : "wine"} />
              </Link>
            </div>
          )}
          {!quiet ? (
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Principale">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.href === "/" ? goHome : undefined}
                  className={cn(
                    "nav-link text-[13px] font-medium tracking-[-0.01em] hover:text-wine",
                    (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                      ? light
                        ? "text-ivory"
                        : "text-wine"
                      : light
                        ? "text-ivory"
                        : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <Link href="/" aria-label="Moluki Alembakate, accueil" onClick={goHome} className="transition-opacity duration-500 hover:opacity-70">
              <Wordmark compact tone="wine" />
            </Link>
          )}
          <div className="flex items-center justify-end gap-1">
            {!quiet ? (
              <button type="button" className="grid h-11 w-11 place-items-center" aria-label="Rechercher" onClick={() => setSearchPath(pathname)}>
                <Search size={18} strokeWidth={1.25} />
              </button>
            ) : null}
            <button type="button" className={cn("relative grid h-11 w-11 place-items-center", bagPop && "bag-pop")} aria-label="Ouvrir le panier" onClick={() => setCart(true)}>
              <ShoppingBag size={18} strokeWidth={1.25} />
              {ready && count > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[9px] text-ivory">{count}</span>
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
