"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Media } from "@/components/media"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { formatPrice } from "@/lib/format"
import { categories } from "@/lib/catalog"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const wishlist = useWishlist()
  const category = categories.find((item) => item.slug === product.category)?.name
  const primary = product.images[0]
  const secondary = product.images[1] ?? product.images[0]
  const soldOut = product.stock <= 0

  function add(size: string) {
    if (soldOut) return
    const color = product.colors[0]?.name ?? "Unique"
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: primary.src,
      price: product.price,
      size,
      color,
      quantity: 1,
    })
    toast(`${product.name} ajouté — ${size}, ${color}`)
  }

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
        <Link href={`/shop/${product.slug}`} data-explore="Voir" className="absolute inset-0">
          <Media src={primary.src} alt={primary.alt} position={primary.position} sizes="(min-width: 1024px) 30vw, 50vw" className="img-zoom" />
          <span className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
            <Media src={secondary.src} alt="" position={secondary.position} sizes="(min-width: 1024px) 30vw, 50vw" />
          </span>
        </Link>
        <button
          type="button"
          aria-pressed={wishlist.has(product.id)}
          aria-label={wishlist.has(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => wishlist.toggle(product.id)}
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] transition duration-300 active:scale-95 ${wishlist.has(product.id) ? "bg-ink text-ivory" : "bg-ivory/90 text-ink"}`}
        >
          {wishlist.has(product.id) ? "Sauvé" : "Favori"}
        </button>
        <div className="absolute inset-x-3 bottom-3 z-10 hidden gap-1 md:flex md:translate-y-2 md:opacity-0 md:transition md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={soldOut}
              onClick={() => add(size)}
              className="flex-1 bg-ivory/95 py-2 text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
            {category}
            {product.isNew ? <span className="ml-2 text-wine">Nouveau</span> : null}
          </p>
          <Link href={`/shop/${product.slug}`} className="nav-link mt-1 inline-block text-[15px] font-medium tracking-tight">
            {product.name}
          </Link>
        </div>
        <p className="shrink-0 text-sm">
          {product.compareAtPrice ? (
            <span className="mr-2 text-stone line-through">{formatPrice(product.compareAtPrice)}</span>
          ) : null}
          {formatPrice(product.price)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 md:hidden">
        {product.sizes.map((size) => (
          <button
            key={size}
            type="button"
            disabled={soldOut}
            onClick={() => add(size)}
            className="border border-line px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-stone disabled:opacity-40"
          >
            {size}
          </button>
        ))}
      </div>
      {soldOut ? <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-stone">Épuisé</p> : null}
    </article>
  )
}
