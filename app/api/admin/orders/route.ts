import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { listOrders, updateOrderStatus } from "@/lib/orders"
import type { OrderStatus } from "@/lib/types"

const statuses: OrderStatus[] = ["pending_payment", "preparing", "cancelled"]

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  return NextResponse.json(listOrders())
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { id?: string; status?: OrderStatus }
  if (!body.id || !body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
  }
  const order = updateOrderStatus(body.id, body.status)
  if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 })
  return NextResponse.json(order)
}
