import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { EmptyState, PageTitle } from "@/components/admin/bits"
import { searchRepository } from "@/lib/repositories/search"

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!(await isAdmin())) return null
  const { q = "" } = await searchParams
  const result = searchRepository.query(q)
  const empty = !result.products.length && !result.orders.length && !result.customers.length
  return (
    <div>
      <PageTitle title="Recherche" text={q ? `Résultats pour « ${q} ».` : "Saisissez un nom, un e-mail ou un numéro de commande."} />
      {q && empty ? <EmptyState title="Aucun résultat." text="Essayez un autre mot, présent dans les pièces, commandes ou clients." /> : null}
      <Result title="Produits" rows={result.products.map((product) => ({ href: `/admin/products/${product.id}`, label: product.name }))} />
      <Result title="Commandes" rows={result.orders.map((order) => ({ href: `/admin/orders/${order.id}`, label: `${order.id} · ${order.customer.lastName}` }))} />
      <Result title="Clients" rows={result.customers.map((customer) => ({ href: `/admin/customers/${customer.id}`, label: `${customer.name} · ${customer.email}` }))} />
    </div>
  )
}

function Result({ title, rows }: { title: string; rows: { href: string; label: string }[] }) {
  if (!rows.length) return null
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-2xl">{title}</h2>
      <ul className="divide-y divide-line border border-line bg-white text-sm">
        {rows.map((row) => (
          <li key={row.href}><Link href={row.href} className="block px-4 py-3">{row.label}</Link></li>
        ))}
      </ul>
    </section>
  )
}
