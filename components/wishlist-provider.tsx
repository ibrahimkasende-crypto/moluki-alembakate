"use client"

import { createContext, useContext, useSyncExternalStore } from "react"

type WishlistContextValue = {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const KEY = "moluki-wishlist"
const empty: string[] = []
let snapshot: string[] = empty
let ready = false
const listeners = new Set<() => void>()

function emit(next: string[]) {
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
        snapshot = raw ? (JSON.parse(raw) as string[]) : empty
      } catch {
        snapshot = empty
      }
      ready = true
      listeners.forEach((item) => item())
    })
  }
  return () => listeners.delete(listener)
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, () => snapshot, () => empty)

  return (
    <WishlistContext.Provider
      value={{
        ids,
        has: (id) => ids.includes(id),
        toggle: (id) => emit(snapshot.includes(id) ? snapshot.filter((item) => item !== id) : [...snapshot, id]),
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist doit être utilisé dans WishlistProvider")
  return context
}
