import { NextResponse } from "next/server"
import { deliveryFee } from "@/lib/format"
import { adjustStock, getProductById } from "@/lib/inventory"
import { saveOrder } from "@/lib/orders"
import { preparePayment } from "@/lib/payments"
import { createId } from "@/lib/store"
import type { CheckoutPayload, Order, OrderItem } from "@/lib/types"

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutPayload
  const customer = body.customer
  const address = body.address
  if (!customer?.firstName || !customer.lastName || !emailOk(customer.email || "") || !customer.phone) {
    return NextResponse.json({ error: "Informations client incomplètes." }, { status: 400 })
  }
  if (!address?.line1 || !address.city || !address.postalCode || !address.country) {
    return NextResponse.json({ error: "Adresse incomplète." }, { status: 400 })
  }
  if (!body.items?.length) return NextResponse.json({ error: "Panier vide." }, { status: 400 })

  const demand = new Map<string, number>()
  const items: OrderItem[] = []

  for (const line of body.items) {
    const product = getProductById(line.productId)
    if (!product) return NextResponse.json({ error: "Une pièce n'est plus disponible." }, { status: 400 })
    const knownColor = product.colors.some((color) => color.name === line.color)
    if (!product.sizes.includes(line.size) || !knownColor) {
      return NextResponse.json({ error: "Variante inconnue." }, { status: 400 })
    }
    const quantity = Math.floor(Number(line.quantity))
    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Quantité invalide." }, { status: 400 })
    }
    demand.set(product.id, (demand.get(product.id) ?? 0) + quantity)
    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      size: line.size,
      color: line.color,
      quantity,
      unitPrice: product.price,
      image: product.images[0]?.src ?? "",
    })
  }

  for (const [productId, quantity] of demand) {
    const product = getProductById(productId)
    if (!product || quantity > product.stock) {
      return NextResponse.json({ error: "Le stock ne couvre plus cette demande." }, { status: 409 })
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const delivery = body.delivery === "express" ? "express" : "standard"
  const fee = deliveryFee(delivery, subtotal)
  const id = createId("MA")
  const payment = await preparePayment(id)
  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    customer,
    address,
    delivery,
    deliveryFee: fee,
    items,
    subtotal,
    total: subtotal + fee,
    note: (body.note || "").slice(0, 500),
    payment,
  }

  for (const item of items) {
    adjustStock(item.productId, -item.quantity, {
      type: "sale",
      size: item.size,
      color: item.color,
      reason: `Commande ${id}`,
    })
  }
  saveOrder(order)
  return NextResponse.json({ orderId: order.id, total: order.total, payment: order.payment })
}
