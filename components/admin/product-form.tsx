"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Product, ProductVariant } from "@/lib/types"

const field = "mt-2 w-full border border-line bg-white px-3 py-2 text-sm outline-none"

export function ProductForm({
  product,
  categories,
  collections,
}: {
  product: Product | null
  categories: { slug: string; name: string }[]
  collections: { slug: string; name: string }[]
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<Product>(
    product ?? {
      id: "",
      name: "",
      slug: "",
      description: "",
      details: "",
      price: 0,
      category: categories[0]?.slug || "chemises",
      collection: collections[0]?.slug || "signature",
      images: [],
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "Noir", hex: "#111110" }],
      stock: 0,
      sku: "",
      featured: false,
      isNew: false,
      bestseller: false,
      createdAt: new Date().toISOString(),
    },
  )
  const [imageUrl, setImageUrl] = useState("")
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState("")
  const initialPrice = product?.price ?? 0

  function patch(partial: Partial<Product>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  function setVariants(variants: ProductVariant[]) {
    patch({ variants })
  }

  async function upload(file: File) {
    const body = new FormData()
    body.set("file", file)
    const response = await fetch("/api/admin/media", { method: "POST", body })
    const payload = (await response.json()) as { path?: string; error?: string }
    if (!response.ok || !payload.path) {
      setError(payload.error || "Image refusée.")
      return
    }
    patch({ images: [...draft.images, { src: payload.path, alt: draft.name || "Moluki" }] })
  }

  async function save() {
    setError("")
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
    const payload = (await response.json()) as Product & { error?: string }
    if (!response.ok) {
      setError(payload.error || "Enregistrement refusé.")
      return
    }
    setConfirm(false)
    router.push(`/admin/products/${payload.id}`)
    router.refresh()
  }

  function askSave(event: React.FormEvent) {
    event.preventDefault()
    if (product && (draft.price !== initialPrice || (draft.compareAtPrice ?? null) !== (product.compareAtPrice ?? null))) {
      setConfirm(true)
      return
    }
    void save()
  }

  return (
    <form onSubmit={askSave} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <section className="grid gap-4 border border-line bg-white p-5 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            Nom
            <input required value={draft.name} onChange={(event) => patch({ name: event.target.value, slug: draft.slug || slugify(event.target.value) })} className={field} />
          </label>
          <label className="text-sm">
            Slug
            <input required value={draft.slug} onChange={(event) => patch({ slug: event.target.value })} className={field} />
          </label>
          <label className="text-sm">
            SKU
            <input value={draft.sku || ""} onChange={(event) => patch({ sku: event.target.value })} className={field} />
          </label>
          <label className="text-sm md:col-span-2">
            Description
            <textarea value={draft.description} onChange={(event) => patch({ description: event.target.value })} className={`${field} min-h-24`} />
          </label>
          <label className="text-sm">
            Prix actuel
            <input type="number" min={0} value={draft.price} onChange={(event) => patch({ price: Number(event.target.value) })} className={field} />
          </label>
          <label className="text-sm">
            Prix promotionnel
            <input type="number" min={0} value={draft.compareAtPrice ?? ""} placeholder="Aucun" onChange={(event) => patch({ compareAtPrice: event.target.value === "" ? undefined : Number(event.target.value) })} className={field} />
          </label>
          {product ? <p className="text-xs text-stone md:col-span-2">Prix précédent enregistré : {initialPrice} €</p> : null}
          <label className="text-sm">
            Catégorie
            <select value={draft.category} onChange={(event) => patch({ category: event.target.value })} className={field}>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Collection
            <select value={draft.collection} onChange={(event) => patch({ collection: event.target.value })} className={field}>
              {collections.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Stock pièce
            <input type="number" min={0} value={draft.stock} onChange={(event) => patch({ stock: Number(event.target.value) })} className={field} disabled={Boolean(draft.variants?.length)} />
          </label>
        </section>

        <section className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Images</h2>
            <label className="cursor-pointer text-xs uppercase tracking-[0.12em]">
              Ajouter un fichier
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file) }} />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="/media/..." className={field} />
            <button
              type="button"
              className="border border-ink px-3 text-xs uppercase tracking-[0.12em]"
              onClick={() => {
                if (!imageUrl.trim()) return
                patch({ images: [...draft.images, { src: imageUrl.trim(), alt: draft.name || "Moluki" }] })
                setImageUrl("")
              }}
            >
              Ajouter
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {draft.images.map((image, index) => (
              <li key={`${image.src}-${index}`} className="flex items-center gap-3">
                <img src={image.src} alt="" className="h-16 w-12 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{image.src}</p>
                  {index === 0 ? <p className="text-[11px] uppercase tracking-[0.14em] text-wine">Image principale</p> : null}
                </div>
                <button type="button" className="text-xs" onClick={() => move(index, -1)} disabled={index === 0}>
                  Monter
                </button>
                <button type="button" className="text-xs" onClick={() => move(index, 1)} disabled={index === draft.images.length - 1}>
                  Descendre
                </button>
                <button type="button" className="text-xs text-wine" onClick={() => patch({ images: draft.images.filter((_, item) => item !== index) })}>
                  Retirer
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Variantes</h2>
            <button
              type="button"
              className="text-xs uppercase tracking-[0.12em]"
              onClick={() => setVariants([...(draft.variants ?? []), { id: `v-${Date.now()}`, size: "M", color: draft.colors[0]?.name || "Noir", stock: 0, sku: "" }])}
            >
              Ajouter
            </button>
          </div>
          <p className="mt-2 text-sm text-stone">Chaque variante a son stock. Le stock de la pièce devient la somme.</p>
          <div className="mt-4 space-y-3">
            {(draft.variants ?? []).map((variant, index) => (
              <div key={variant.id} className="grid grid-cols-2 gap-2 md:grid-cols-5">
                <input value={variant.size} onChange={(event) => editVariant(index, { size: event.target.value })} className={field} placeholder="Taille" />
                <input value={variant.color} onChange={(event) => editVariant(index, { color: event.target.value })} className={field} placeholder="Couleur" />
                <input type="number" min={0} value={variant.stock} onChange={(event) => editVariant(index, { stock: Number(event.target.value) })} className={field} />
                <input value={variant.sku} onChange={(event) => editVariant(index, { sku: event.target.value })} className={field} placeholder="SKU" />
                <button type="button" className="text-xs text-wine" onClick={() => setVariants(draft.variants?.filter((_, item) => item !== index) ?? [])}>
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <aside className="h-fit space-y-4 border border-line bg-white p-5">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(draft.archived)} onChange={(event) => patch({ archived: event.target.checked })} />
          Archivé
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.featured} onChange={(event) => patch({ featured: event.target.checked })} />
          Vedette
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.isNew} onChange={(event) => patch({ isNew: event.target.checked })} />
          Nouveau
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.bestseller} onChange={(event) => patch({ bestseller: event.target.checked })} />
          Best seller
        </label>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <button type="submit" className="w-full bg-ink py-3 text-[11px] uppercase tracking-[0.16em] text-ivory">
          Enregistrer
        </button>
      </aside>
      {confirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" role="dialog" aria-modal="true" aria-label="Confirmer le prix">
          <div className="w-full max-w-md bg-white p-6">
            <p className="font-serif text-2xl">Modifier le prix</p>
            <p className="mt-3 text-sm">Prix actuel : {draft.price} €. Prix précédent : {initialPrice} €.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirm(false)}>
                Annuler
              </button>
              <button type="button" className="bg-ink px-4 py-2 text-sm text-ivory" onClick={() => void save()}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  )

  function move(index: number, direction: number) {
    const images = [...draft.images]
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const [item] = images.splice(index, 1)
    images.splice(target, 0, item)
    patch({ images })
  }

  function editVariant(index: number, partial: Partial<ProductVariant>) {
    setVariants((draft.variants ?? []).map((variant, item) => (item === index ? { ...variant, ...partial } : variant)))
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
