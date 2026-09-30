import { recordAudit } from "@/lib/audit-log"
import { readJson, writeJson } from "@/lib/store"
import type { Order, OrderStatus } from "@/lib/types"

export function listOrders() {
  return readJson<Order[]>("orders.json", []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function getOrder(id: string) {
  return listOrders().find((order) => order.id === id) ?? null
}

export function saveOrder(order: Order) {
  const orders = listOrders().filter((item) => item.id !== order.id)
  orders.unshift(order)
  writeJson("orders.json", orders)
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const order = getOrder(id)
  if (!order) return null
  const history = [...(order.history ?? [{ at: order.createdAt, status: order.status }]), { at: new Date().toISOString(), status }]
  const next = { ...order, status, history }
  saveOrder(next)
  recordAudit({
    action: "Statut de commande modifié",
    target: order.id,
    before: order.status,
    after: status,
  })
  return next
}

export function updateOrderNote(id: string, internalNote: string) {
  const order = getOrder(id)
  if (!order) return null
  const next = { ...order, internalNote: internalNote.slice(0, 1000) }
  saveOrder(next)
  recordAudit({ action: "Note interne enregistrée", target: order.id })
  return next
}
