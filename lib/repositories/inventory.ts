import { listCatalog } from "@/lib/inventory"
import { listMovements } from "@/lib/stock-log"
import { settingsRepository } from "@/lib/repositories/settings"

export type StockRow = {
  productId: string
  name: string
  sku: string
  variant: string
  stock: number
  threshold: number
  status: "in" | "low" | "out"
}

function statusFor(stock: number, threshold: number): StockRow["status"] {
  if (stock <= 0) return "out"
  if (stock <= threshold) return "low"
  return "in"
}

export const inventoryRepository = {
  rows(): StockRow[] {
    const threshold = settingsRepository.get().lowStockThreshold
    return listCatalog().flatMap((product) => {
      if (product.variants?.length) {
        return product.variants.map((variant) => ({
          productId: product.id,
          name: product.name,
          sku: variant.sku || product.sku || "—",
          variant: `${variant.size} · ${variant.color}`,
          stock: variant.stock,
          threshold,
          status: statusFor(variant.stock, threshold),
        }))
      }
      return [
        {
          productId: product.id,
          name: product.name,
          sku: product.sku || "—",
          variant: "Pièce",
          stock: product.stock,
          threshold,
          status: statusFor(product.stock, threshold),
        },
      ]
    })
  },
  summary() {
    const rows = this.rows()
    return {
      total: rows.reduce((sum, row) => sum + row.stock, 0),
      available: rows.filter((row) => row.status === "in").length,
      low: rows.filter((row) => row.status === "low").length,
      out: rows.filter((row) => row.status === "out").length,
    }
  },
  movements: () => listMovements(),
}
