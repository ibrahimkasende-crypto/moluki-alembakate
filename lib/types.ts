export const categorySlugs = [
  "chemises",
  "polos",
  "complets",
  "pantalons",
  "t-shirts",
  "accessoires",
] as const

export type CategorySlug = (typeof categorySlugs)[number]

export const collectionSlugs = ["nouvelle-saison", "essentiels", "signature"] as const

export type CollectionSlug = (typeof collectionSlugs)[number]

export type GalleryImage = {
  src: string
  alt: string
  position?: string
}

export type ProductColor = {
  name: string
  hex: string
}

export type ProductVariant = {
  id: string
  size: string
  color: string
  stock: number
  sku: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  details: string
  price: number
  compareAtPrice?: number
  category: string
  collection: string
  images: GalleryImage[]
  sizes: string[]
  colors: ProductColor[]
  stock: number
  sku?: string
  archived?: boolean
  variants?: ProductVariant[]
  featured: boolean
  isNew: boolean
  bestseller: boolean
  createdAt: string
}

export type CartItem = {
  lineId: string
  productId: string
  slug: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

export type DeliveryMethod = "standard" | "express"

export type OrderStatus = "pending_payment" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed" | "not_charged"

export type OrderEvent = {
  at: string
  status: OrderStatus
}

export type OrderItem = {
  productId: string
  name: string
  slug: string
  size: string
  color: string
  quantity: number
  unitPrice: number
  image: string
}

export type Order = {
  id: string
  createdAt: string
  status: OrderStatus
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    line1: string
    city: string
    postalCode: string
    country: string
  }
  delivery: DeliveryMethod
  deliveryFee: number
  items: OrderItem[]
  subtotal: number
  total: number
  note: string
  internalNote?: string
  history?: OrderEvent[]
  payment: {
    provider: "unconfigured"
    status: PaymentStatus
  }
}

export type CheckoutPayload = {
  customer: Order["customer"]
  address: Order["address"]
  delivery: DeliveryMethod
  note: string
  items: { productId: string; size: string; color: string; quantity: number }[]
}
