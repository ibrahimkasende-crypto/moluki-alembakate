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
  const next = { ...order, status }
  saveOrder(next)
  return next
}
