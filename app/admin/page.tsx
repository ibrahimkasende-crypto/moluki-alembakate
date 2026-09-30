import Link from "next/link"
import { EmptyState, GrainBar, Kpi, PageTitle, RangeBar, money, when } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { Greeting } from "@/components/admin/greeting"
import { SalesChart } from "@/components/admin/sales-chart"
import { orderStatusLabel, paymentStatusLabel } from "@/lib/admin/labels"
import { analyticsRepository } from "@/lib/repositories/analytics"
import { inventoryRepository } from "@/lib/repositories/inventory"
import { ordersRepository } from "@/lib/repositories/orders"

export const dynamic = "force-dynamic"

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string; grain?: string }> }) {
  if (!(await isAdmin())) return null
  const query = await searchParams
  const range = analyticsRepository.range(query)
  const grain = analyticsRepository.grain(range, query.grain)
  const custom = range.key === "custom" && query.from && query.to ? `&from=${query.from}&to=${query.to}` : ""
  const stats = analyticsRepository.summarize(range)
  const series = analyticsRepository.series(range, grain)
  const recent = ordersRepository.list().slice(0, 6)
  const low = inventoryRepository.rows().filter((row) => row.status !== "in").slice(0, 6)
  const top = analyticsRepository.topProducts(range).slice(0, 5)
  const activity = ordersRepository.activity()

  return (
    <div>
      <Greeting />
      <PageTitle title="Moluki Alembakate" text={stats.orders ? `${stats.orders} demande${stats.orders > 1 ? "s" : ""} sur la période. ${money(stats.requested)} non encaissés. Le paiement n'est pas connecté.` : "Aucune commande sur cette période."}>
        <Link href="/admin/products/new" className="bg-ink px-3 py-2 text-xs uppercase tracking-[0.12em] text-ivory">Nouveau produit</Link>
        <Link href="/admin/collections" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Nouvelle collection</Link>
        <Link href="/admin/promotions" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Nouvelle promotion</Link>
        <Link href="/admin/orders" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Voir commandes</Link>
        <Link href="/admin/inventory" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Voir stock faible</Link>
      </PageTitle>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <RangeBar path="/admin" current={range.key} />
        <form action="/admin" className="flex flex-wrap gap-2">
          <input type="hidden" name="range" value="custom" />
          <input type="date" name="from" className="border border-line bg-white px-2 py-2 text-xs" />
          <input type="date" name="to" className="border border-line bg-white px-2 py-2 text-xs" />
          <button className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Personnalisé</button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Kpi label="Chiffre d'affaires" value={money(stats.revenue)} delta={stats.revenueDelta} hint="Encaissé" />
        <Kpi label="Commandes" value={String(stats.orders)} delta={stats.ordersDelta} hint="Enregistrées" />
        <Kpi label="Panier moyen" value={stats.average == null ? "Aucune donnée" : money(stats.average)} delta={stats.averageDelta} hint="Sur paiements validés" />
        <Kpi label="Clients" value={String(stats.clients)} delta={stats.clientsDelta} />
        <Kpi label="Pièces vendues" value={String(stats.units)} delta={stats.unitsDelta} hint="Commandes payées" />
        <Kpi label="Taux de conversion" value="Aucune donnée" delta={null} hint="Visites non mesurées" />
      </div>
      <div className="mt-6">
        <div className="mb-3"><GrainBar path="/admin" range={range.key} grain={grain} extra={custom} /></div>
        {series.length ? <SalesChart points={series} /> : <EmptyState title="Aucune vente sur cette période." text="Le graphique apparaîtra dès qu'une commande réelle sera enregistrée." />}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 font-serif text-2xl">Commandes récentes</h2>
          {recent.length ? (
            <div className="overflow-x-auto border border-line bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
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
                  {recent.map((order) => (
                    <tr key={order.id} className="border-t border-line">
                      <td className="px-3 py-3"><Link href={`/admin/orders/${order.id}`} className="underline">{order.id}</Link></td>
                      <td className="px-3 py-3">{order.customer.firstName} {order.customer.lastName}</td>
                      <td className="px-3 py-3">{when(order.createdAt)}</td>
                      <td className="px-3 py-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td className="px-3 py-3">{money(order.total)}</td>
                      <td className="px-3 py-3">{orderStatusLabel[order.status]}</td>
                      <td className="px-3 py-3">{paymentStatusLabel[order.payment.status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Aucune commande." text="Les demandes passées sur la boutique apparaîtront ici." />
          )}
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl">Stock faible</h2>
          {low.length ? (
            <ul className="divide-y divide-line border border-line bg-white">
              {low.map((row) => (
                <li key={`${row.productId}-${row.variant}`} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{row.name} · {row.variant}</span>
                  <span>{row.stock === 0 ? "Rupture" : `${row.stock} restants`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Aucune alerte stock." text="Les ruptures et les stocks sous le seuil s'afficheront ici." />
          )}
        </section>
      </div>
      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Pièces les plus demandées</h2>
        {top.length ? (
          <ol className="divide-y divide-line border border-line bg-white">
            {top.map((item, index) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>{index + 1}. {item.name}</span>
                <span>{item.units} commandée{item.units > 1 ? "s" : ""} · {money(item.revenue)} encaissés · stock {item.stock ?? "—"}</span>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState title="Pas encore de demande." text="Le classement suit les commandes réellement enregistrées." />
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-serif text-2xl">Activité récente</h2>
        {activity.length ? (
          <ul className="divide-y divide-line border border-line bg-white">
            {activity.map((entry) => (
              <li key={entry.id} className="px-4 py-3 text-sm">
                <span className="text-stone">{when(entry.at)} · {entry.actor}</span>
                <span className="mt-1 block">{entry.action} — {entry.target}{entry.before ? ` · ${entry.before} → ${entry.after}` : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Aucune activité enregistrée." text="Les changements de prix, de statut et de stock seront journalisés ici." />
        )}
      </section>
    </div>
  )
}
