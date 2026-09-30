"use client"

import { CartProvider } from "@/components/cart-provider"
import { ExploreCursor } from "@/components/explore-cursor"
import { WishlistProvider } from "@/components/wishlist-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <ExploreCursor />
      </WishlistProvider>
    </CartProvider>
  )
}
