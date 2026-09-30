import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { recordAudit } from "@/lib/audit-log"
import { adjustStock, listCatalog } from "@/lib/inventory"
import type { StockMovementType } from "@/lib/stock-log"

const types: StockMovementType[] = ["in", "sale", "correction", "return", "loss"]

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("inventory.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { productId?: string; quantity?: number; type?: StockMovementType; reason?: string; size?: string; color?: string }
  const quantity = Math.round(Number(body.quantity))
  if (!body.productId || !body.type || !types.includes(body.type) || !Number.isFinite(quantity) || quantity === 0) {
    return NextResponse.json({ error: "Mouvement invalide." }, { status: 400 })
  }
  const product = listCatalog().find((item) => item.id === body.productId)
  if (!product) return NextResponse.json({ error: "Pièce introuvable." }, { status: 404 })
  const delta = body.type === "sale" || body.type === "loss" ? -Math.abs(quantity) : Math.abs(quantity)
  const next = adjustStock(product.id, delta, { type: body.type, reason: body.reason || "", size: body.size, color: body.color })
  recordAudit({ action: "Stock modifié", target: product.name, before: String(product.stock), after: String(next?.stock ?? "") })
  return NextResponse.json({ ok: true })
}
