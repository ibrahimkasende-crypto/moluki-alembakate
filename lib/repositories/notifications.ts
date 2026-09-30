import { inventoryRepository } from "@/lib/repositories/inventory"
import { listOrders } from "@/lib/orders"
import { promotionsRepository } from "@/lib/repositories/promotions"

export type Notice = { id: string; title: string; href: string }

export const notificationsRepository = {
  list(): Notice[] {
    const notices: Notice[] = []
    const fresh = listOrders().filter((order) => order.status === "pending_payment")
    if (fresh.length) notices.push({ id: "orders", title: `${fresh.length} commande${fresh.length > 1 ? "s" : ""} nouvelle${fresh.length > 1 ? "s" : ""}`, href: "/admin/orders?status=pending_payment" })
    const stock = inventoryRepository.summary()
    if (stock.low) notices.push({ id: "low", title: `${stock.low} référence${stock.low > 1 ? "s" : ""} en stock faible`, href: "/admin/inventory" })
    if (stock.out) notices.push({ id: "out", title: `${stock.out} rupture${stock.out > 1 ? "s" : ""}`, href: "/admin/inventory" })
    const now = Date.now()
    const ended = promotionsRepository.list().filter((promo) => promo.status === "active" && promo.endsAt && new Date(promo.endsAt).getTime() < now)
    if (ended.length) notices.push({ id: "promo", title: `${ended.length} promotion${ended.length > 1 ? "s" : ""} terminée${ended.length > 1 ? "s" : ""}`, href: "/admin/promotions" })
    return notices
  },
}
