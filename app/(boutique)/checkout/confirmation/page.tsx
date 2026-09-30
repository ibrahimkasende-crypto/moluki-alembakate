import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatPrice } from "@/lib/format"
import { getOrder } from "@/lib/orders"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Demande enregistrée", robots: { index: false } }

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: orderId } = await searchParams
  if (!orderId) notFound()
  const order = getOrder(orderId)
  if (!order) notFound()

  return (
    <div className="px-5 pb-24 pt-32 md:px-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-wine">Demande enregistrée</p>
      <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] md:text-7xl">Aucun paiement n&apos;a été encaissé.</h1>
      <p className="mt-6 max-w-xl text-stone">
        La référence {order.id} est notée pour la maison. Le règlement sera confirmé lorsque le paiement sera connecté. En attendant, la commande reste en attente.
      </p>
      <dl className="mt-10 max-w-lg space-y-3 text-sm">
        <div className="flex justify-between border-b border-line py-2"><dt>Total demandé</dt><dd>{formatPrice(order.total)}</dd></div>
        <div className="flex justify-between border-b border-line py-2"><dt>Livraison</dt><dd>{formatPrice(order.deliveryFee)}</dd></div>
        <div className="flex justify-between border-b border-line py-2"><dt>Statut</dt><dd>En attente de paiement</dd></div>
      </dl>
      <ul className="mt-8 max-w-lg text-sm text-stone">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.size}`}>{item.name} · {item.color} · {item.size} · {item.quantity}</li>
        ))}
      </ul>
      <Link href="/shop" className="mt-10 inline-block text-[11px] uppercase tracking-[0.18em] underline underline-offset-4">
        Retour à la boutique
      </Link>
    </div>
  )
}
