import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { notFound } from "next/navigation"
import { PageTitle, money, when } from "@/components/admin/bits"
import { OrderPanel } from "@/components/admin/panels"
import { orderStatusLabel, paymentStatusLabel } from "@/lib/admin/labels"
import { ordersRepository } from "@/lib/repositories/orders"
import { deliveryLabel } from "@/lib/format"

export const dynamic = "force-dynamic"

const steps = [
  ["pending_payment", "Commande reçue"],
  ["confirmed", "Confirmée"],
  ["preparing", "Préparation"],
  ["shipped", "Expédition"],
  ["delivered", "Livraison"],
] as const

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return null
  const { id } = await params
  const order = ordersRepository.get(id)
  if (!order) notFound()
  const history = order.history?.length ? order.history : [{ at: order.createdAt, status: order.status }]
  const current = steps.findIndex((step) => step[0] === order.status)

  return (
    <div>
      <PageTitle title={order.id} text={`${order.customer.firstName} ${order.customer.lastName} · ${when(order.createdAt)}`} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <ol className="grid gap-3 border border-line bg-white p-5 sm:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step[0]} className={index <= current && order.status !== "cancelled" ? "text-ink" : "text-stone"}>
                <span className="block text-[11px] uppercase tracking-[0.14em]">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 block text-sm">{step[1]}</span>
              </li>
            ))}
          </ol>
          {order.status === "cancelled" ? <p className="text-sm text-wine">Commande annulée.</p> : null}
          <section className="border border-line bg-white p-5 text-sm">
            <p>{order.customer.email}</p>
            <p className="mt-1">{order.customer.phone}</p>
            <p className="mt-3">{order.address.line1}</p>
            <p>{order.address.postalCode} {order.address.city}</p>
            <p>{order.address.country}</p>
            <p className="mt-3 text-stone">{deliveryLabel(order.delivery)}</p>
          </section>
          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-stone">
                <tr>
                  <th className="px-3 py-3">Pièce</th>
                  <th className="px-3 py-3">Variante</th>
                  <th className="px-3 py-3">Qté</th>
                  <th className="px-3 py-3">Prix</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`} className="border-t border-line">
                    <td className="px-3 py-3">{item.name}</td>
                    <td className="px-3 py-3">{item.size} · {item.color}</td>
                    <td className="px-3 py-3">{item.quantity}</td>
                    <td className="px-3 py-3">{money(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="grid max-w-sm gap-2 text-sm">
            <div className="flex justify-between"><dt>Sous-total</dt><dd>{money(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd>{money(order.deliveryFee)}</dd></div>
            <div className="flex justify-between font-medium"><dt>Total</dt><dd>{money(order.total)}</dd></div>
            <div className="flex justify-between"><dt>Paiement</dt><dd>{paymentStatusLabel[order.payment.status]}</dd></div>
          </dl>
          {order.note ? <p className="text-sm text-stone">Note client : {order.note}</p> : null}
          <section>
            <h2 className="mb-3 font-serif text-2xl">Historique</h2>
            <ul className="space-y-2 text-sm">
              {history.map((event) => (
                <li key={`${event.at}-${event.status}`}>{when(event.at)} · {orderStatusLabel[event.status]}</li>
              ))}
            </ul>
          </section>
        </div>
        <OrderPanel order={order} />
      </div>
      <Link href={`/admin/customers/${encodeURIComponent(order.customer.email)}`} className="mt-6 inline-block text-sm underline">
        Fiche client
      </Link>
    </div>
  )
}
