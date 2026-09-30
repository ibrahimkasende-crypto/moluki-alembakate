import { createId, readJson, writeJson } from "@/lib/store"

export type StockMovementType = "in" | "sale" | "correction" | "return" | "loss"

export type StockMovement = {
  id: string
  at: string
  productId: string
  productName: string
  sku: string
  variant: string
  type: StockMovementType
  quantity: number
  before: number
  after: number
  reason: string
}

export function listMovements() {
  return readJson<StockMovement[]>("stock-movements.json", []).sort((a, b) => (a.at < b.at ? 1 : -1))
}

export function recordMovement(entry: Omit<StockMovement, "id" | "at">) {
  const all = listMovements()
  all.unshift({ ...entry, id: createId("SK"), at: new Date().toISOString() })
  writeJson("stock-movements.json", all.slice(0, 500))
}
