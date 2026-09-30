import { EmptyState, GrainBar, Kpi, PageTitle, RangeBar, money } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { SalesChart } from "@/components/admin/sales-chart"
import { orderStatusLabel } from "@/lib/admin/labels"
import { analyticsRepository } from "@/lib/repositories/analytics"
import type { OrderStatus } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string; grain?: string }> }) {
  if (!(await isAdmin())) return null
  const query = await searchParams
  const range = analyticsRepository.range(query)
  const grain = analyticsRepository.grain(range, query.grain)
  const custom = range.key === "custom" && query.from && query.to ? `&from=${query.from}&to=${query.to}` : ""
  const stats = analyticsRepository.summarize(range)
  const series = analyticsRepository.series(range, grain)
  const categories = analyticsRepository.byCategory(range)
  const ranked = analyticsRepository.topProducts(range)
  const mix = analyticsRepository.statusMix(range)
  const max = Math.max(1, ...categories.map((item) => item.units))

  return (
    <div>
      <PageTitle title="Analytics" text="Tout est calculé sur les commandes enregistrées. Le chiffre d'affaires ne compte que les paiements validés." />
      <div className="mb-6"><RangeBar path="/admin/analytics" current={range.key} /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Chiffre d'affaires" value={money(stats.revenue)} delta={stats.revenueDelta} />
        <Kpi label="Commandes" value={String(stats.orders)} delta={stats.ordersDelta} />
        <Kpi label="Clients" value={String(stats.clients)} delta={stats.clientsDelta} />
        <Kpi label="Panier moyen" value={stats.average == null ? "Aucune donnée" : money(stats.average)} delta={stats.averageDelta} />
      </div>
      <div className="mt-6">
        <div className="mb-3"><GrainBar path="/admin/analytics" range={range.key} grain={grain} extra={custom} /></div>
        {series.length ? <SalesChart points={series} /> : <EmptyState title="Pas de série." text="Aucune commande sur cette période." />}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-serif text-2xl">Demandes par catégorie</h2>
          {categories.length ? categories.map((item) => (
            <div key={item.category} className="mb-3">
              <div className="mb-1 flex justify-between text-sm"><span>{item.category}</span><span>{item.units}</span></div>
              <div className="h-1.5 bg-line"><div className="h-full bg-ink" style={{ width: `${(item.units / max) * 100}%` }} /></div>
            </div>
          )) : <EmptyState title="Aucune répartition." text="Les catégories se rempliront avec les commandes." />}
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl">Statuts</h2>
          {mix.length ? (
            <ul className="divide-y divide-line border border-line bg-white text-sm">
              {mix.map((item) => <li key={item.status} className="flex justify-between px-4 py-3"><span>{orderStatusLabel[item.status as OrderStatus] || item.status}</span><span>{item.count}</span></li>)}
            </ul>
          ) : <EmptyState title="Aucune commande." text="La répartition des statuts est vide." />}
        </section>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Rank title="Les plus demandées" rows={ranked.slice(0, 5)} />
        <Rank title="Les moins demandées" rows={[...ranked].reverse().slice(0, 5)} />
      </div>
    </div>
  )
}

function Rank({ title, rows }: { title: string; rows: { id: string; name: string; units: number; revenue: number; stock: number | null }[] }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-2xl">{title}</h2>
      {rows.length ? (
        <ol className="divide-y divide-line border border-line bg-white text-sm">
          {rows.map((row, index) => (
            <li key={row.id} className="flex justify-between px-4 py-3">
              <span>{index + 1}. {row.name}</span>
              <span>{row.units} · {money(row.revenue)} · stock {row.stock ?? "—"}</span>
            </li>
          ))}
        </ol>
      ) : <EmptyState title="Pas de classement." text="Il n'y a pas encore de pièces commandées." />}
    </section>
  )
}
