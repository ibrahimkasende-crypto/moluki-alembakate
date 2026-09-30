"use client"

import Link from "next/link"
import { Media } from "@/components/media"
import { useCart } from "@/components/cart-provider"
import { deliveryFee, formatPrice } from "@/lib/format"

export function CartView() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const shipping = deliveryFee("standard", subtotal)

  if (items.length === 0) {
    return (
      <div className="px-5 pb-24 pt-28 md:px-12">
        <h1 className="font-serif text-6xl">Panier</h1>
        <p className="mt-6 max-w-md text-stone">Aucune pièce pour le moment.</p>
        <Link href="/shop" className="mt-8 inline-block bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">
          Entrer dans la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-12 px-5 pb-24 pt-28 md:px-12 lg:grid-cols-[1.4fr_0.7fr]">
      <div>
        <h1 className="font-serif text-6xl">Panier</h1>
        <ul className="mt-10 divide-y divide-line">
          {items.map((item) => (
            <li key={item.lineId} className="grid grid-cols-[96px_1fr] gap-4 py-6 md:grid-cols-[120px_1fr_auto]">
              <div className="relative aspect-[3/4] bg-ivory">
                <Media src={item.image} alt="" sizes="120px" />
              </div>
              <div>
                <Link href={`/shop/${item.slug}`} className="font-serif text-3xl">{item.name}</Link>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone">{item.color} · {item.size}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" aria-label="Diminuer" className="h-9 w-9 border border-line" onClick={() => updateQuantity(item.lineId, Math.max(1, item.quantity - 1))}>−</button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label="Augmenter" className="h-9 w-9 border border-line" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button>
                  <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-stone" onClick={() => removeItem(item.lineId)}>Retirer</button>
                </div>
              </div>
              <p className="text-sm md:text-right">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit border-t border-ink pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Résumé</p>
        <div className="mt-6 space-y-3 text-sm">
          <Row label="Sous-total" value={formatPrice(subtotal)} />
          <Row label="Livraison standard" value={shipping === 0 ? "Offerte" : formatPrice(shipping)} />
          <Row label="Total estimé" value={formatPrice(subtotal + shipping)} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-stone">Le montant définitif est recalculé à l&apos;enregistrement. Aucun paiement n&apos;est encaissé à cette étape.</p>
        <Link href="/checkout" className="mt-6 block bg-ink py-4 text-center text-[11px] uppercase tracking-[0.18em] text-ivory">
          Commander
        </Link>
      </aside>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
