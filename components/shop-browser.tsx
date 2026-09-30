"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { categories } from "@/lib/catalog"
import type { Product } from "@/lib/types"

type Initial = {
  category: string
  q: string
  sort: string
}

const sorts = [
  { id: "featured", label: "Sélection" },
  { id: "newest", label: "Plus récent" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
]

export function ShopBrowser({ products, initial }: { products: Product[]; initial: Initial }) {
  const router = useRouter()
  const [category, setCategory] = useState(initial.category)
  const [query, setQuery] = useState(initial.q)
  const [sort, setSort] = useState(initial.sort)
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const sizes = [...new Set(products.flatMap((product) => product.sizes))]
  const colors = [...new Set(products.flatMap((product) => product.colors.map((item) => item.name)))]

  const visible = useMemo(() => {
    const minValue = min ? Number(min) : null
    const maxValue = max ? Number(max) : null
    const list = products.filter((product) => {
      if (category !== "tous" && product.category !== category) return false
      if (query) {
        const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase()
        if (!haystack.includes(query.toLowerCase())) return false
      }
      if (minValue !== null && product.price < minValue) return false
      if (maxValue !== null && product.price > maxValue) return false
      if (size && !product.sizes.includes(size)) return false
      if (color && !product.colors.some((item) => item.name === color)) return false
      return true
    })
    return list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "newest") return a.createdAt < b.createdAt ? 1 : -1
      return Number(b.featured) - Number(a.featured) || Number(b.isNew) - Number(a.isNew)
    })
  }, [products, category, query, sort, min, max, size, color])

  function chooseCategory(next: string) {
    setCategory(next)
    const params = new URLSearchParams()
    if (next !== "tous") params.set("category", next)
    if (query) params.set("q", query)
    if (sort !== "featured") params.set("sort", sort)
    const suffix = params.toString()
    router.replace(suffix ? `/shop?${suffix}` : "/shop", { scroll: false })
  }

  const filters = (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Catégorie</p>
        <div className="mt-3 flex flex-col items-start gap-2">
          <FilterButton active={category === "tous"} onClick={() => chooseCategory("tous")}>Tous</FilterButton>
          {categories.map((item) => (
            <FilterButton key={item.slug} active={category === item.slug} onClick={() => chooseCategory(item.slug)}>
              {item.name}
            </FilterButton>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Prix</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-xs text-stone">
            Min
            <input value={min} onChange={(event) => setMin(event.target.value)} inputMode="numeric" className="mt-1 w-full border border-line bg-transparent px-2 py-2" />
          </label>
          <label className="text-xs text-stone">
            Max
            <input value={max} onChange={(event) => setMax(event.target.value)} inputMode="numeric" className="mt-1 w-full border border-line bg-transparent px-2 py-2" />
          </label>
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Taille</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterButton active={size === ""} onClick={() => setSize("")}>Toutes</FilterButton>
          {sizes.map((item) => (
            <FilterButton key={item} active={size === item} onClick={() => setSize(item)}>{item}</FilterButton>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Couleur</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterButton active={color === ""} onClick={() => setColor("")}>Toutes</FilterButton>
          {colors.map((item) => (
            <FilterButton key={item} active={color === item} onClick={() => setColor(item)}>{item}</FilterButton>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="px-5 pb-20 md:px-12">
      <div className="mb-8 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
        <p className="text-sm text-stone">{visible.length} pièce{visible.length > 1 ? "s" : ""}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="border border-line px-3 py-2 text-[11px] uppercase tracking-[0.16em] md:hidden" onClick={() => setFiltersOpen(true)}>
            Filtrer
          </button>
          <label className="sr-only" htmlFor="shop-search">Recherche</label>
          <input
            id="shop-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher"
            className="border-b border-line bg-transparent px-1 py-2 text-sm outline-none"
          />
          <label className="sr-only" htmlFor="shop-sort">Trier</label>
          <select id="shop-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent py-2 text-sm outline-none">
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:block">{filters}</aside>
        {visible.length === 0 ? (
          <p className="font-serif text-4xl">Aucune pièce pour cette recherche.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {filtersOpen ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-ivory px-5 pb-10 pt-8 md:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="mb-8 flex justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em]">Filtres</p>
            <button type="button" onClick={() => setFiltersOpen(false)}>Fermer</button>
          </div>
          {filters}
        </div>
      ) : null}
    </div>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`text-left text-sm ${active ? "text-wine" : "text-ink"}`} aria-pressed={active}>
      {children}
    </button>
  )
}
