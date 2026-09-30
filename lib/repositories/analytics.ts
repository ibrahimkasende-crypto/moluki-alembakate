import { listCatalog } from "@/lib/inventory"
import { listOrders } from "@/lib/orders"
import { inRange, percentChange, resolveRange, type ResolvedRange } from "@/lib/admin/period"
import type { Order } from "@/lib/types"

function paid(orders: Order[]) {
  return orders.filter((order) => order.payment.status === "paid" && order.status !== "cancelled")
}

function active(orders: Order[]) {
  return orders.filter((order) => order.status !== "cancelled")
}

function money(orders: Order[]) {
  return paid(orders).reduce((sum, order) => sum + order.total, 0)
}

function slice(orders: Order[], start: Date, end: Date) {
  return orders.filter((order) => inRange(order.createdAt, start, end))
}

export type SalesPoint = { label: string; revenue: number; orders: number }

function grainOf(range: ResolvedRange, override?: string) {
  if (override === "day" || override === "week" || override === "month") return override
  const days = (range.end.getTime() - range.start.getTime()) / 86400000
  if (days <= 31) return "day"
  if (days <= 120) return "week"
  return "month"
}

function bucketStart(date: Date, grain: "day" | "week" | "month") {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  if (grain === "month") next.setDate(1)
  if (grain === "week") next.setDate(next.getDate() - ((next.getDay() + 6) % 7))
  return next
}

function labelFor(date: Date, grain: "day" | "week" | "month") {
  if (grain === "month") return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

export const analyticsRepository = {
  range: resolveRange,
  grain(range: ResolvedRange, override?: string) {
    return grainOf(range, override)
  },
  summarize(range: ResolvedRange) {
    const orders = listOrders()
    const current = slice(orders, range.start, range.end)
    const previous = range.previousStart && range.previousEnd ? slice(orders, range.previousStart, range.previousEnd) : []
    const revenue = money(current)
    const previousRevenue = money(previous)
    const orderCount = active(current).length
    const previousOrders = active(previous).length
    const paidCount = paid(current).length
    const previousPaid = paid(previous).length
    const clients = new Set(active(current).map((order) => order.customer.email.toLowerCase())).size
    const previousClients = new Set(active(previous).map((order) => order.customer.email.toLowerCase())).size
    const units = paid(current).reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    const previousUnits = paid(previous).reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    const requested = active(current).reduce((sum, order) => sum + order.total, 0)
    return {
      revenue,
      revenueDelta: percentChange(revenue, previousRevenue),
      orders: orderCount,
      ordersDelta: percentChange(orderCount, previousOrders),
      average: paidCount > 0 ? Math.round(revenue / paidCount) : null,
      averageDelta: previousPaid > 0 && paidCount > 0 ? percentChange(revenue / paidCount, previousRevenue / previousPaid) : null,
      clients,
      clientsDelta: percentChange(clients, previousClients),
      units,
      unitsDelta: percentChange(units, previousUnits),
      requested,
      comparable: Boolean(range.previousStart),
    }
  },
  series(range: ResolvedRange, grain?: string): SalesPoint[] {
    const mode = grainOf(range, grain)
    const orders = slice(listOrders(), range.start, range.end)
    const buckets = new Map<number, SalesPoint>()
    for (const order of orders) {
      if (order.status === "cancelled") continue
      const start = bucketStart(new Date(order.createdAt), mode)
      const key = start.getTime()
      const current = buckets.get(key) ?? { label: labelFor(start, mode), revenue: 0, orders: 0 }
      current.orders += 1
      if (order.payment.status === "paid") current.revenue += order.total
      buckets.set(key, current)
    }
    return [...buckets.entries()].sort((a, b) => a[0] - b[0]).map((entry) => entry[1])
  },
  topProducts(range: ResolvedRange) {
    const orders = active(slice(listOrders(), range.start, range.end))
    const map = new Map<string, { id: string; name: string; units: number; revenue: number }>()
    for (const order of orders) {
      for (const item of order.items) {
        const current = map.get(item.productId) ?? { id: item.productId, name: item.name, units: 0, revenue: 0 }
        current.units += item.quantity
        if (order.payment.status === "paid") current.revenue += item.unitPrice * item.quantity
        map.set(item.productId, current)
      }
    }
    const stock = new Map(listCatalog().map((product) => [product.id, product.stock]))
    return [...map.values()]
      .map((item) => ({ ...item, stock: stock.get(item.id) ?? null }))
      .sort((a, b) => b.units - a.units)
  },
  byCategory(range: ResolvedRange) {
    const products = new Map(listCatalog().map((product) => [product.id, product.category]))
    const map = new Map<string, number>()
    for (const order of active(slice(listOrders(), range.start, range.end))) {
      for (const item of order.items) {
        const category = products.get(item.productId) || "Autre"
        map.set(category, (map.get(category) ?? 0) + item.quantity)
      }
    }
    return [...map.entries()].map(([category, units]) => ({ category, units })).sort((a, b) => b.units - a.units)
  },
  statusMix(range: ResolvedRange) {
    const map = new Map<string, number>()
    for (const order of slice(listOrders(), range.start, range.end)) {
      map.set(order.status, (map.get(order.status) ?? 0) + 1)
    }
    return [...map.entries()].map(([status, count]) => ({ status, count }))
  },
}
