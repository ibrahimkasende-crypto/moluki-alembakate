"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  FileText,
  Images,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  Warehouse,
  X,
} from "lucide-react"
import { Wordmark } from "@/components/wordmark"
import type { Notice } from "@/lib/repositories/notifications"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Catalogue", icon: Package },
  { href: "/admin/inventory", label: "Stock", icon: Warehouse },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/reports", label: "Rapports", icon: FileText },
  { href: "/admin/content", label: "Contenu", icon: Images },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

function active(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname.startsWith(href)
}

export function AdminShell({ children, notices }: { children: React.ReactNode; notices: Notice[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState(false)

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Administration">
      {links.map((item) => {
        const Icon = item.icon
        const on = active(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
              on ? "bg-wine text-ivory" : "text-ink/80 hover:bg-paper",
            )}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="md:hidden xl:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#f3f1ec] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[4.5rem] flex-col border-r border-line bg-white px-2 py-5 md:flex xl:w-60 xl:px-4">
        <Link href="/" aria-label="Moluki Alembakate, accueil" className="mb-8 px-2">
          <Wordmark compact className="hidden xl:inline-flex" />
          <span className="grid h-9 w-9 place-items-center font-serif text-sm xl:hidden">M</span>
        </Link>
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" aria-label="Moluki Alembakate, accueil" onClick={() => setOpen(false)}>
                <Wordmark compact />
              </Link>
              <button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
      <div className="md:pl-[4.5rem] xl:pl-60">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <button type="button" className="md:hidden" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <form action="/admin/search" className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="admin-search">
              Recherche
            </label>
            <input id="admin-search" name="q" placeholder="Produits, commandes, clients" className="w-full max-w-md border border-line bg-paper px-3 py-2 text-sm outline-none" />
          </form>
          <div className="relative">
            <button type="button" className="relative px-2 text-sm" aria-expanded={alerts} onClick={() => setAlerts((value) => !value)}>
              Alertes
              {notices.length ? <span className="ml-1 inline-grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-[10px] text-ivory">{notices.length}</span> : null}
            </button>
            {alerts ? (
              <div className="absolute right-0 z-30 mt-2 w-72 border border-line bg-white p-3 text-sm shadow-sm">
                {notices.length ? (
                  notices.map((notice) => (
                    <Link key={notice.id} href={notice.href} className="block py-2 hover:text-wine" onClick={() => setAlerts(false)}>
                      {notice.title}
                    </Link>
                  ))
                ) : (
                  <p className="py-2 text-stone">Aucune alerte.</p>
                )}
              </div>
            ) : null}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="hidden text-sm text-stone hover:text-ink sm:inline">
            Aperçu
          </a>
          <Link href="/" className="hidden text-sm sm:inline">
            Voir la boutique
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="text-sm text-stone hover:text-ink">
              Sortir
            </button>
          </form>
        </header>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  )
}
