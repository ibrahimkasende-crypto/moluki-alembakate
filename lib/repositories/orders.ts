import { listAudit } from "@/lib/audit-log"
import { getOrder, listOrders, updateOrderNote, updateOrderStatus } from "@/lib/orders"
import type { OrderStatus } from "@/lib/types"

export const ordersRepository = {
  list: () => listOrders(),
  get: (id: string) => getOrder(id),
  setStatus: (id: string, status: OrderStatus) => updateOrderStatus(id, status),
  setNote: (id: string, note: string) => updateOrderNote(id, note),
  activity: () => listAudit().slice(0, 12),
}
