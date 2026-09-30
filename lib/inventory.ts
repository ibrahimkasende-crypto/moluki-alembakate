import { seedProducts } from "@/lib/catalog"
import { recordMovement } from "@/lib/stock-log"
import { readJson, writeJson } from "@/lib/store"
import type { Product } from "@/lib/types"

type Overrides = {
  patches: Record<string, Partial<Product>>
  extra: Product[]
  deleted: string[]
}

const empty = (): Overrides => ({ patches: {}, extra: [], deleted: [] })

function load(): Overrides {
  return { ...empty(), ...readJson<Overrides>("overrides.json", empty()) }
}

function assemble(): Product[] {
  const file = load()
  const seeded = seedProducts
    .filter((product) => !file.deleted.includes(product.id))
    .map((product) => ({ ...product, ...file.patches[product.id], id: product.id }))
  const extras = file.extra.filter((product) => !file.deleted.includes(product.id))
  return [...seeded, ...extras].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function listCatalog() {
  return assemble()
}

export function getAllProducts(): Product[] {
  return assemble().filter((product) => !product.archived)
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug) ?? null
}

export function getProductById(id: string) {
  return getAllProducts().find((product) => product.id === id) ?? null
}

function normalize(product: Product): Product {
  const variants = product.variants?.map((variant) => ({
    ...variant,
    stock: Math.max(0, Math.round(variant.stock) || 0),
    sku: variant.sku.trim(),
    size: variant.size.trim(),
    color: variant.color.trim(),
  }))
  if (!variants?.length) return { ...product, variants: undefined }
  const colors = [...product.colors]
  for (const variant of variants) {
    if (variant.color && !colors.some((color) => color.name === variant.color)) {
      colors.push({ name: variant.color, hex: "#111110" })
    }
  }
  const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))]
  return {
    ...product,
    variants,
    colors,
    sizes: sizes.length ? sizes : product.sizes,
    stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
  }
}

export function saveProduct(product: Product) {
  const next = normalize(product)
  const file = load()
  const seeded = seedProducts.some((item) => item.id === product.id)
  if (seeded) {
    const { id, ...patch } = next
    file.patches[id] = patch
  } else {
    const index = file.extra.findIndex((item) => item.id === next.id)
    if (index >= 0) file.extra[index] = next
    else file.extra.push(next)
  }
  file.deleted = file.deleted.filter((id) => id !== next.id)
  writeJson("overrides.json", file)
}

export function removeProduct(id: string) {
  const file = load()
  file.extra = file.extra.filter((product) => product.id !== id)
  delete file.patches[id]
  if (!file.deleted.includes(id)) file.deleted.push(id)
  writeJson("overrides.json", file)
}

export function adjustStock(
  productId: string,
  delta: number,
  meta?: { type?: "in" | "sale" | "correction" | "return" | "loss"; size?: string; color?: string; reason?: string },
) {
  const product = listCatalog().find((item) => item.id === productId)
  if (!product) return null
  const before = product.stock
  let next: Product = { ...product, stock: Math.max(0, before + delta) }
  let variantLabel = ""
  if (next.variants?.length && meta?.size && meta.color) {
    const variants = next.variants.map((variant) => {
      if (variant.size !== meta.size || variant.color !== meta.color) return variant
      variantLabel = `${variant.size} · ${variant.color}`
      return { ...variant, stock: Math.max(0, variant.stock + delta) }
    })
    next = { ...next, variants, stock: variants.reduce((sum, variant) => sum + variant.stock, 0) }
  }
  saveProduct(next)
  recordMovement({
    productId: next.id,
    productName: next.name,
    sku: next.sku || "",
    variant: variantLabel,
    type: meta?.type ?? (delta < 0 ? "sale" : "correction"),
    quantity: delta,
    before,
    after: next.stock,
    reason: meta?.reason || "",
  })
  return next
}
