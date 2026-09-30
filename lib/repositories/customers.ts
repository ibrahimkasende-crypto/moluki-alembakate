import { listOrders } from "@/lib/orders"
import type { Order } from "@/lib/types"

export type CustomerProfile = {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  spent: number
  requested: number
  lastOrderAt: string
  since: string
}

function group(orders: Order[]) {
  const map = new Map<string, Order[]>()
  for (const order of orders) {
    const key = order.customer.email.trim().toLowerCase()
    map.set(key, [...(map.get(key) ?? []), order])
  }
  return [...map.entries()].map(([email, rows]) => {
    const latest = [...rows].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]
    const spent = rows.filter((order) => order.payment.status === "paid" && order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)
    const requested = rows.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)
    return {
      id: encodeURIComponent(email),
      name: `${latest.customer.firstName} ${latest.customer.lastName}`.trim(),
      email,
      phone: latest.customer.phone,
      orders: rows.length,
      spent,
      requested,
      lastOrderAt: latest.createdAt,
      since: [...rows].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))[0].createdAt,
    } satisfies CustomerProfile
  })
}

export const customersRepository = {
  list() {
    return group(listOrders()).sort((a, b) => (a.lastOrderAt < b.lastOrderAt ? 1 : -1))
  },
  get(id: string) {
    const email = decodeURIComponent(id).toLowerCase()
    const profile = this.list().find((customer) => customer.email === email) ?? null
    if (!profile) return null
    const orders = listOrders().filter((order) => order.customer.email.trim().toLowerCase() === email)
    const bought = new Map<string, { name: string; quantity: number }>()
    for (const order of orders) {
      if (order.status === "cancelled") continue
      for (const item of order.items) {
        const current = bought.get(item.productId) ?? { name: item.name, quantity: 0 }
        current.quantity += item.quantity
        bought.set(item.productId, current)
      }
    }
    return { profile, orders, products: [...bought.values()] }
  },
}
