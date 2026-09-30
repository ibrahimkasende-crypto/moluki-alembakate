import { recordAudit } from "@/lib/audit-log"
import { listCatalog, removeProduct, saveProduct } from "@/lib/inventory"
import { createId } from "@/lib/store"
import type { Product } from "@/lib/types"

export const productsRepository = {
  list: () => listCatalog(),
  get: (id: string) => listCatalog().find((product) => product.id === id) ?? null,
  save(product: Product, previous?: Product | null) {
    const price = Math.max(0, Math.round(product.price))
    const compare = product.compareAtPrice == null ? undefined : Math.max(0, Math.round(product.compareAtPrice))
    const next = { ...product, price, compareAtPrice: compare, stock: Math.max(0, Math.round(product.stock)) }
    saveProduct(next)
    if (previous && previous.price !== price) {
      recordAudit({
        action: "Prix modifié",
        target: next.name,
        before: String(previous.price),
        after: String(price),
      })
    }
    return next
  },
  create(product: Product) {
    const id = product.id || createId("PR")
    const saved = this.save({ ...product, id, createdAt: product.createdAt || new Date().toISOString() })
    recordAudit({ action: "Produit créé", target: saved.name })
    return saved
  },
  duplicate(id: string) {
    const product = this.get(id)
    if (!product) return null
    const copy = this.create({
      ...product,
      id: createId("PR"),
      name: `${product.name} copie`,
      slug: `${product.slug}-copie-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      featured: false,
    })
    recordAudit({ action: "Produit dupliqué", target: product.name, after: copy.name })
    return copy
  },
  archive(id: string) {
    const product = this.get(id)
    if (!product) return null
    this.save({ ...product, archived: !product.archived })
    recordAudit({ action: product.archived ? "Produit réactivé" : "Produit archivé", target: product.name })
    return this.get(id)
  },
  remove(id: string) {
    const product = this.get(id)
    if (!product) return false
    removeProduct(id)
    recordAudit({ action: "Produit retiré du catalogue", target: product.name })
    return true
  },
}
