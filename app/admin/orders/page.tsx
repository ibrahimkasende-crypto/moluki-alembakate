import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { EmptyState, PageTitle, money, when } from "@/components/admin/bits"
import { orderStatusLabel, paymentStatusLabel } from "@/lib/admin/labels"
import { ordersRepository } from "@/lib/repositories/orders"
import type { OrderStatus } from "@/lib/types"

export const dynamic = "force-dynamic"

const filters: { key: string; label: string }[] = [
  { key: "", label: "Toutes" },
  { key: "pending_payment", label: "Nouvelles" },
  { key: "confirmed", label: "Confirmées" },
  { key: "preparing", label: "En préparation" },
  { key: "shipped", label: "Expédiées" },
  { key: "delivered", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
]

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string; sort?: string }> }) {
  if (!(await isAdmin())) return null
  const query = await searchParams
  const q = (query.q || "").trim().toLowerCase()
  let rows = ordersRepository.list()
  if (query.status) rows = rows.filter((order) => order.status === query.status)
  if (q) rows = rows.filter((order) => `${order.id} ${order.customer.firstName} ${order.customer.lastName} ${order.customer.email}`.toLowerCase().includes(q))
  if (query.sort === "amount") rows = [...rows].sort((a, b) => b.total - a.total)
  const page = Math.max(1, Number(query.page) || 1)
  const size = 8
  const slice = rows.slice((page - 1) * size, page * size)
  const pages = Math.max(1, Math.ceil(rows.length / size))

  return (
    <div>
      <PageTitle title="Commandes" text="Demandes enregistrées par la boutique. Le paiement n'est pas encaissé depuis cet écran.">
        <a href="/api/admin/export?kind=orders" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Export CSV</a>
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link key={filter.label} href={filter.key ? `/admin/orders?status=${filter.key}` : "/admin/orders"} className={`px-3 py-2 text-xs uppercase tracking-[0.12em] ${query.status === filter.key || (!query.status && !filter.key) ? "bg-ink text-ivory" : "bg-white"}`}>
            {filter.label}
          </Link>
        ))}
      </div>
      <form className="mb-4 flex flex-wrap gap-2" action="/admin/orders">
        {query.status ? <input type="hidden" name="status" value={query.status} /> : null}
        <input name="q" defaultValue={query.q || ""} placeholder="Rechercher" className="border border-line bg-white px-3 py-2 text-sm" />
        <select name="sort" defaultValue={query.sort || "date"} className="border border-line bg-white px-3 py-2 text-sm">
          <option value="date">Date</option>
          <option value="amount">Montant</option>
        </select>
        <button className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.12em] text-ivory">Filtrer</button>
      </form>
      {slice.length ? (
        <>
          <div className="hidden overflow-x-auto border border-line bg-white md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-stone">
                <tr>
                  <th className="px-3 py-3">Commande</th>
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Articles</th>
                  <th className="px-3 py-3">Montant</th>
                  <th className="px-3 py-3">Statut</th>
                  <th className="px-3 py-3">Paiement</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((order) => (
                  <tr key={order.id} className="border-t border-line">
                    <td className="px-3 py-3"><Link className="underline" href={`/admin/orders/${order.id}`}>{order.id}</Link></td>
                    <td className="px-3 py-3">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="px-3 py-3">{when(order.createdAt)}</td>
                    <td className="px-3 py-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-3 py-3">{money(order.total)}</td>
                    <td className="px-3 py-3">{orderStatusLabel[order.status as OrderStatus]}</td>
                    <td className="px-3 py-3">{paymentStatusLabel[order.payment.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {slice.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="block border border-line bg-white p-4 text-sm">
                <p className="font-medium">{order.id}</p>
                <p className="mt-1">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="mt-2 text-stone">{orderStatusLabel[order.status]} · {paymentStatusLabel[order.payment.status]} · {money(order.total)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2 text-sm">
            {Array.from({ length: pages }).map((_, index) => (
              <Link key={index} href={`/admin/orders?page=${index + 1}${query.status ? `&status=${query.status}` : ""}${q ? `&q=${q}` : ""}`} className={`px-3 py-1 ${page === index + 1 ? "bg-ink text-ivory" : "bg-white"}`}>
                {index + 1}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <EmptyState title="Aucune commande pour cette sélection." text="Changez le filtre ou attendez une demande réelle." />
      )}
    </div>
  )
}
