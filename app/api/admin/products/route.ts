import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { getAllProducts, saveProduct } from "@/lib/inventory"
import type { Product } from "@/lib/types"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  return NextResponse.json(getAllProducts())
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as Product
  if (!body.id || !body.name || !Number.isFinite(body.price) || !Number.isFinite(body.stock)) {
    return NextResponse.json({ error: "Pièce invalide." }, { status: 400 })
  }
  saveProduct({ ...body, price: Math.max(0, Math.round(body.price)), stock: Math.max(0, Math.round(body.stock)) })
  return NextResponse.json({ ok: true })
}
