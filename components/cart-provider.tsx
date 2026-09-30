"use client"

import { createContext, useContext, useMemo, useSyncExternalStore } from "react"
import type { CartItem } from "@/lib/types"

type CartContextValue = {
  items: CartItem[]
  ready: boolean
  addItem: (item: Omit<CartItem, "lineId">) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)
const KEY = "moluki-cart"
const empty: CartItem[] = []
let snapshot: CartItem[] = empty
let ready = false
const listeners = new Set<() => void>()

function emit(next: CartItem[]) {
  snapshot = next
  ready = true
  localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!ready) {
    queueMicrotask(() => {
      if (ready) return
      try {
        const raw = localStorage.getItem(KEY)
        snapshot = raw ? (JSON.parse(raw) as CartItem[]) : empty
      } catch {
        snapshot = empty
      }
      ready = true
      listeners.forEach((item) => item())
    })
  }
  return () => listeners.delete(listener)
}

export function lineIdFor(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, () => snapshot, () => empty)
  const isReady = useSyncExternalStore(subscribe, () => ready, () => false)

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      items,
      ready: isReady,
      count,
      subtotal,
      addItem: (item) => {
        const lineId = lineIdFor(item.productId, item.size, item.color)
        const existing = snapshot.find((entry) => entry.lineId === lineId)
        emit(
          existing
            ? snapshot.map((entry) => (entry.lineId === lineId ? { ...entry, quantity: entry.quantity + item.quantity } : entry))
            : [...snapshot, { ...item, lineId }],
        )
      },
      removeItem: (lineId) => emit(snapshot.filter((item) => item.lineId !== lineId)),
      updateQuantity: (lineId, quantity) => {
        if (quantity < 1) return
        emit(snapshot.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)))
      },
      clear: () => emit([]),
    }
  }, [items, isReady])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider")
  return context
}
