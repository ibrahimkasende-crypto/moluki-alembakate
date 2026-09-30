import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { notFound } from "next/navigation"
import { PageTitle, money, when } from "@/components/admin/bits"
import { orderStatusLabel } from "@/lib/admin/labels"
import { customersRepository } from "@/lib/repositories/customers"

export const dynamic = "force-dynamic"

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return null
  const { id } = await params
  const record = customersRepository.get(id)
  if (!record) notFound()
  const { profile, orders, products } = record

  return (
    <div>
      <PageTitle title={profile.name} text={`${profile.email} · ${profile.phone}`} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="border border-line bg-white p-5"><p className="text-xs uppercase tracking-[0.14em] text-stone">Commandes</p><p className="mt-2 font-serif text-3xl">{profile.orders}</p></article>
        <article className="border border-line bg-white p-5"><p className="text-xs uppercase tracking-[0.14em] text-stone">Encaissé</p><p className="mt-2 font-serif text-3xl">{money(profile.spent)}</p></article>
        <article className="border border-line bg-white p-5"><p className="text-xs uppercase tracking-[0.14em] text-stone">Depuis</p><p className="mt-2 font-serif text-3xl">{when(profile.since)}</p></article>
      </div>
      <h2 className="mb-3 font-serif text-2xl">Pièces commandées</h2>
      <ul className="mb-8 divide-y divide-line border border-line bg-white text-sm">
        {products.length ? products.map((product) => <li key={product.name} className="flex justify-between px-4 py-3"><span>{product.name}</span><span>{product.quantity}</span></li>) : <li className="px-4 py-3 text-stone">Aucune pièce.</li>}
      </ul>
      <h2 className="mb-3 font-serif text-2xl">Commandes</h2>
      <ul className="divide-y divide-line border border-line bg-white text-sm">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/admin/orders/${order.id}`} className="flex flex-wrap justify-between gap-2 px-4 py-3">
              <span>{order.id}</span>
              <span>{when(order.createdAt)} · {orderStatusLabel[order.status]} · {money(order.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
