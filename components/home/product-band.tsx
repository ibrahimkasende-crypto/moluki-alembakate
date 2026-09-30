import { ProductCard } from "@/components/product-card"
import { Kicker } from "@/components/page-header"
import type { Product } from "@/lib/types"

export function ProductBand({ index, title, products }: { index: string; title: string; products: Product[] }) {
  if (products.length === 0) return null
  return (
    <section className="px-5 py-16 md:px-12">
      <Kicker index={index}>{title}</Kicker>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
