import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { productsRepository } from "@/lib/repositories/products"
import type { Product } from "@/lib/types"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  return NextResponse.json(productsRepository.list())
}

export async function PATCH(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as Product
  if (!body.id || !body.name || !Number.isFinite(body.price) || !Number.isFinite(body.stock)) {
    return NextResponse.json({ error: "Pièce invalide." }, { status: 400 })
  }
  const previous = productsRepository.get(body.id)
  const saved = previous ? productsRepository.save(body, previous) : productsRepository.create(body)
  return NextResponse.json(saved)
}

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { action?: string; id?: string } & Partial<Product>
  if (body.action === "duplicate" && body.id) {
    const copy = productsRepository.duplicate(body.id)
    if (!copy) return NextResponse.json({ error: "Pièce introuvable." }, { status: 404 })
    return NextResponse.json(copy)
  }
  if (body.action === "archive" && body.id) {
    const product = productsRepository.archive(body.id)
    if (!product) return NextResponse.json({ error: "Pièce introuvable." }, { status: 404 })
    return NextResponse.json(product)
  }
  if (!body.name || !Number.isFinite(body.price)) return NextResponse.json({ error: "Pièce invalide." }, { status: 400 })
  return NextResponse.json(productsRepository.create(body as Product))
}

export async function DELETE(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const id = new URL(request.url).searchParams.get("id")
  if (!id || !productsRepository.remove(id)) return NextResponse.json({ error: "Pièce introuvable." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
