import { ProductCard } from "@/components/product-card"
import { TextReveal } from "@/components/motion"
import type { Product } from "@/lib/types"

export function FeaturedShop({ products }: { products: Product[] }) {
  return (
    <section className="section-space bg-paper" aria-label="Boutique">
      <div className="shell">
        <TextReveal text="Boutique" className="font-serif text-5xl leading-[0.92] md:text-7xl" />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
