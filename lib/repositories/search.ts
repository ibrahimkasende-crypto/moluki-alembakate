import { customersRepository } from "@/lib/repositories/customers"
import { listOrders } from "@/lib/orders"
import { productsRepository } from "@/lib/repositories/products"

export const searchRepository = {
  query(term: string) {
    const q = term.trim().toLowerCase()
    if (!q) return { products: [], orders: [], customers: [] }
    return {
      products: productsRepository.list().filter((product) => `${product.name} ${product.sku ?? ""} ${product.category}`.toLowerCase().includes(q)).slice(0, 8),
      orders: listOrders().filter((order) => `${order.id} ${order.customer.firstName} ${order.customer.lastName} ${order.customer.email}`.toLowerCase().includes(q)).slice(0, 8),
      customers: customersRepository.list().filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(q)).slice(0, 8),
    }
  },
}
