import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { toCsv } from "@/lib/admin/csv"
import { orderStatusLabel, paymentStatusLabel } from "@/lib/admin/labels"
import { customersRepository } from "@/lib/repositories/customers"
import { inventoryRepository } from "@/lib/repositories/inventory"
import { ordersRepository } from "@/lib/repositories/orders"
import { productsRepository } from "@/lib/repositories/products"

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const kind = new URL(request.url).searchParams.get("kind") || "orders"
  const rows = build(kind)
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="moluki-${kind}.csv"`,
    },
  })
}

function build(kind: string): string[][] {
  if (kind === "products") {
    return [["Produit", "Catégorie", "Prix", "Stock", "Statut"], ...productsRepository.list().map((product) => [product.name, product.category, String(product.price), String(product.stock), product.archived ? "Archivé" : "Actif"])]
  }
  if (kind === "stock") {
    return [["Produit", "SKU", "Variante", "Stock", "Seuil", "Statut"], ...inventoryRepository.rows().map((row) => [row.name, row.sku, row.variant, String(row.stock), String(row.threshold), row.status])]
  }
  if (kind === "customers") {
    return [["Nom", "Email", "Téléphone", "Commandes", "Encaissé"], ...customersRepository.list().map((customer) => [customer.name, customer.email, customer.phone, String(customer.orders), String(customer.spent)])]
  }
  if (kind === "sales") {
    return [["Commande", "Date", "Total", "Paiement"], ...ordersRepository.list().filter((order) => order.payment.status === "paid").map((order) => [order.id, order.createdAt, String(order.total), paymentStatusLabel[order.payment.status]])]
  }
  return [["Commande", "Client", "Email", "Date", "Montant", "Statut", "Paiement"], ...ordersRepository.list().map((order) => [order.id, `${order.customer.firstName} ${order.customer.lastName}`, order.customer.email, order.createdAt, String(order.total), orderStatusLabel[order.status], paymentStatusLabel[order.payment.status]])]
}
