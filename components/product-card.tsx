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
        <Link href={`/shop/${product.slug}`} className="absolute inset-0">
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
          className="absolute right-3 top-3 text-[11px] uppercase tracking-[0.14em] text-ivory mix-blend-difference"
        >
          {wishlist.has(product.id) ? "Sauvé" : "Favori"}
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
          {category}
          {product.isNew ? <span className="ml-3 text-wine">Nouveau</span> : null}
        </p>
        <Link href={`/shop/${product.slug}`} className="nav-link mt-2 inline-block font-serif text-3xl leading-none">
          {product.name}
        </Link>
        <p className="mt-2 text-sm">
          {product.compareAtPrice ? (
            <span className="mr-2 text-stone line-through">{formatPrice(product.compareAtPrice)}</span>
          ) : null}
          {formatPrice(product.price)}
          <span className="ml-3 text-[11px] uppercase tracking-[0.14em] text-stone">{soldOut ? "Épuisé" : "En stock"}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={soldOut}
              onClick={() => add(size)}
              className="px-1 py-1 text-[11px] uppercase tracking-[0.16em] text-stone transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
