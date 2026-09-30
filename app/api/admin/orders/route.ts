import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { ordersRepository } from "@/lib/repositories/orders"
import type { OrderStatus } from "@/lib/types"

const statuses: OrderStatus[] = ["pending_payment", "confirmed", "preparing", "shipped", "delivered", "cancelled"]

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  return NextResponse.json(ordersRepository.list())
}

export async function PATCH(request: Request) {
  if (!(await isAdmin()) || !can("orders.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { id?: string; status?: OrderStatus; internalNote?: string }
  if (!body.id) return NextResponse.json({ error: "Commande introuvable." }, { status: 400 })
  if (typeof body.internalNote === "string") {
    const order = ordersRepository.setNote(body.id, body.internalNote)
    if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 })
    return NextResponse.json(order)
  }
  if (!body.status || !statuses.includes(body.status)) return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
  const order = ordersRepository.setStatus(body.id, body.status)
  if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 })
  return NextResponse.json(order)
}
