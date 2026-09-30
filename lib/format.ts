import type { DeliveryMethod } from "@/lib/types"

export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function deliveryFee(method: DeliveryMethod, subtotal: number) {
  if (method === "express") return 18
  return subtotal >= 250 ? 0 : 12
}

export function deliveryLabel(method: DeliveryMethod) {
  return method === "express" ? "Livraison express" : "Livraison standard"
}
