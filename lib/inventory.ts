import { seedProducts } from "@/lib/catalog"
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

export function getAllProducts(): Product[] {
  const file = load()
  const seeded = seedProducts
    .filter((product) => !file.deleted.includes(product.id))
    .map((product) => ({ ...product, ...file.patches[product.id], id: product.id }))
  const extras = file.extra.filter((product) => !file.deleted.includes(product.id))
  return [...seeded, ...extras].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug) ?? null
}

export function getProductById(id: string) {
  return getAllProducts().find((product) => product.id === id) ?? null
}

export function saveProduct(product: Product) {
  const file = load()
  const seeded = seedProducts.some((item) => item.id === product.id)
  if (seeded) {
    const { id, ...patch } = product
    file.patches[id] = patch
  } else {
    const index = file.extra.findIndex((item) => item.id === product.id)
    if (index >= 0) file.extra[index] = product
    else file.extra.push(product)
  }
  file.deleted = file.deleted.filter((id) => id !== product.id)
  writeJson("overrides.json", file)
}

export function removeProduct(id: string) {
  const file = load()
  file.extra = file.extra.filter((product) => product.id !== id)
  delete file.patches[id]
  if (!file.deleted.includes(id)) file.deleted.push(id)
  writeJson("overrides.json", file)
}

export function adjustStock(productId: string, delta: number) {
  const product = getProductById(productId)
  if (!product) return
  saveProduct({ ...product, stock: Math.max(0, product.stock + delta) })
}
