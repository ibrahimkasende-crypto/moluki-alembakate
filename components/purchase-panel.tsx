"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/format"
import { sizeGuide } from "@/lib/catalog"
import { whatsappHref } from "@/lib/site"
import type { Product } from "@/lib/types"

export function PurchasePanel({ product, whatsapp }: { product: Product; whatsapp: string | null }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0] ?? "Unique")
  const [color, setColor] = useState(product.colors[0]?.name ?? "Unique")
  const [quantity, setQuantity] = useState(1)
  const [guide, setGuide] = useState(false)
  const soldOut = product.stock <= 0

  function add(thenCheckout = false) {
    if (soldOut) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.src ?? "",
      price: product.price,
      size,
      color,
      quantity,
    })
    if (thenCheckout) {
      router.push("/checkout")
      return
    }
    toast("Ajouté au panier")
  }

  const message = `Bonjour, je souhaite ${product.name} — taille ${size}, couleur ${color}, quantité ${quantity}.`
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : whatsappHref(message)

  return (
    <div>
      <p className="text-lg">{formatPrice(product.price)}</p>
      {product.compareAtPrice ? <p className="text-sm text-stone line-through">{formatPrice(product.compareAtPrice)}</p> : null}
      <p className="mt-3 text-sm text-stone">{soldOut ? "Épuisé pour le moment." : "En stock. Préparé par la maison."}</p>

      <fieldset className="mt-8">
        <legend className="text-[11px] uppercase tracking-[0.18em]">Couleur</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.colors.map((item) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={color === item.name}
              onClick={() => setColor(item.name)}
              className={`flex items-center gap-2 border px-3 py-2 text-sm ${color === item.name ? "border-ink" : "border-line"}`}
            >
              <span className="h-3 w-3 border border-line" style={{ background: item.hex }} />
              {item.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[11px] uppercase tracking-[0.18em]">Taille</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={size === item}
              onClick={() => setSize(item)}
              className={`min-w-12 border px-3 py-2 text-sm ${size === item ? "border-ink bg-ink text-ivory" : "border-line"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button type="button" className="mt-3 text-[11px] uppercase tracking-[0.16em] text-wine underline underline-offset-4" onClick={() => setGuide(true)}>
          Guide des tailles
        </button>
      </fieldset>

      <div className="mt-6 flex items-center gap-4">
        <label htmlFor="qty" className="text-[11px] uppercase tracking-[0.18em]">
          Quantité
        </label>
        <div className="flex items-center border border-line">
          <button type="button" className="h-11 w-11" aria-label="Diminuer la quantité" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            −
          </button>
          <span className="w-8 text-center" id="qty">
            {quantity}
          </span>
          <button type="button" className="h-11 w-11" aria-label="Augmenter la quantité" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}>
            +
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <button type="button" disabled={soldOut} onClick={() => add(false)} className="bg-ink py-4 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-40">
          Ajouter au panier
        </button>
        <button type="button" disabled={soldOut} onClick={() => add(true)} className="border border-ink py-4 text-[11px] uppercase tracking-[0.2em] disabled:opacity-40">
          Acheter maintenant
        </button>
        {whatsappLink ? (
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="py-3 text-center text-[11px] uppercase tracking-[0.18em] text-wine">
            Commander via WhatsApp
          </a>
        ) : (
          <p className="text-center text-xs text-stone">La commande WhatsApp sera reliée dès que le numéro de la maison est renseigné.</p>
        )}
      </div>

      {guide ? (
        <div className="fixed inset-0 z-[60] grid place-items-end bg-ink/40 md:place-items-center" role="dialog" aria-modal="true" aria-labelledby="guide-title">
          <div className="max-h-[85vh] w-full max-w-lg overflow-auto bg-ivory p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 id="guide-title" className="font-serif text-4xl">Guide des tailles</h2>
              <button type="button" onClick={() => setGuide(false)} className="text-[11px] uppercase tracking-[0.16em]">
                Fermer
              </button>
            </div>
            <p className="mt-3 text-sm text-stone">Mesures indicatives en centimètres, corps. La coupe Moluki reste proche sans serrer.</p>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-stone">
                  <th className="py-2 font-normal">Taille</th>
                  <th className="py-2 font-normal">Poitrine</th>
                  <th className="py-2 font-normal">Taille</th>
                  <th className="py-2 font-normal">Hanches</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuide.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <td className="py-3">{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.waist}</td>
                    <td>{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
