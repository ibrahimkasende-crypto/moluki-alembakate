import type { OrderStatus, PaymentStatus } from "@/lib/types"
import type { StockMovementType } from "@/lib/stock-log"

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending_payment: "Nouvelle",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échec",
  not_charged: "Non facturé",
}

export const movementLabel: Record<StockMovementType, string> = {
  in: "Entrée",
  sale: "Vente",
  correction: "Correction",
  return: "Retour",
  loss: "Perte",
}

export const orderFlow: OrderStatus[] = ["pending_payment", "confirmed", "preparing", "shipped", "delivered"]
