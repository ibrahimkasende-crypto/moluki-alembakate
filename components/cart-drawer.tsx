"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Media } from "@/components/media"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/format"

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="ml-auto flex h-full w-full max-w-md flex-col bg-ivory"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.2em]">Panier</p>
          <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-[0.18em]">
            Fermer
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {items.length === 0 ? (
            <p className="font-serif text-3xl">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.lineId} className="grid grid-cols-[88px_1fr] gap-4">
                  <div className="relative aspect-[3/4] bg-paper">
                    <Media src={item.image} alt="" sizes="88px" />
                  </div>
                  <div>
                    <Link href={`/shop/${item.slug}`} onClick={onClose} className="font-serif text-2xl leading-none">
                      {item.name}
                    </Link>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone">
                      {item.color} · {item.size}
                    </p>
                    <p className="mt-2 text-sm">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <button type="button" aria-label="Diminuer" onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="h-8 w-8 border border-line">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label="Augmenter" onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="h-8 w-8 border border-line">
                        +
                      </button>
                      <button type="button" onClick={() => removeItem(item.lineId)} className="ml-auto text-[11px] uppercase tracking-[0.14em] text-stone">
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-5 py-5">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-stone">Livraison calculée à la commande. Offerte dès 250 €.</p>
          <Link
            href="/cart"
            onClick={onClose}
            className="mt-5 block bg-ink py-3 text-center text-[11px] uppercase tracking-[0.18em] text-ivory"
          >
            Voir le panier
          </Link>
        </div>
      </aside>
    </div>
  )
}
