import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { EmptyState, PageTitle, when } from "@/components/admin/bits"
import { StockForm } from "@/components/admin/panels"
import { movementLabel } from "@/lib/admin/labels"
import { inventoryRepository } from "@/lib/repositories/inventory"
import { productsRepository } from "@/lib/repositories/products"

export const dynamic = "force-dynamic"

const labels = { in: "En stock", low: "Stock faible", out: "Rupture" }

export default async function InventoryPage() {
  if (!(await isAdmin())) return null
  const summary = inventoryRepository.summary()
  const rows = inventoryRepository.rows()
  const movements = inventoryRepository.movements().slice(0, 30)
  const products = productsRepository.list().filter((product) => !product.archived)

  return (
    <div>
      <PageTitle title="Stock" text="Chaque correction laisse une trace. Le seuil se règle dans Paramètres." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Stock total", summary.total],
          ["Disponibles", summary.available],
          ["Stock faible", summary.low],
          ["Ruptures", summary.out],
        ].map(([label, value]) => (
          <article key={String(label)} className="border border-line bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </article>
        ))}
      </div>
      <StockForm products={products} />
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <article key={`${row.productId}-${row.variant}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-4 py-3 text-sm">
            <div>
              <Link href={`/admin/products/${row.productId}`} className="font-medium">{row.name}</Link>
              <p className="text-stone">{row.sku} · {row.variant}</p>
            </div>
            <p>{row.stock} / seuil {row.threshold} · {labels[row.status]}</p>
          </article>
        ))}
      </div>
      <h2 className="mb-3 mt-10 font-serif text-2xl">Mouvements</h2>
      {movements.length ? (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Produit</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Quantité</th>
                <th className="px-3 py-3">Avant</th>
                <th className="px-3 py-3">Après</th>
                <th className="px-3 py-3">Motif</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((move) => (
                <tr key={move.id} className="border-t border-line">
                  <td className="px-3 py-3">{when(move.at)}</td>
                  <td className="px-3 py-3">{move.productName}{move.variant ? ` · ${move.variant}` : ""}</td>
                  <td className="px-3 py-3">{movementLabel[move.type]}</td>
                  <td className="px-3 py-3">{move.quantity}</td>
                  <td className="px-3 py-3">{move.before}</td>
                  <td className="px-3 py-3">{move.after}</td>
                  <td className="px-3 py-3">{move.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Aucun mouvement." text="Une vente, une entrée ou une correction apparaîtra ici." />
      )}
    </div>
  )
}
