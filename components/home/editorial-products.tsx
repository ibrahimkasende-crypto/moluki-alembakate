import Link from "next/link"
import { ImageReveal } from "@/components/image-reveal"
import { Media } from "@/components/media"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"

export function EditorialProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-10 md:py-16" aria-label="Pièces">
      {products.map((product, index) => {
        const image = product.images[0]
        const flip = index % 2 === 1
        return (
          <article key={product.id} className="grid items-center gap-8 px-5 py-12 md:grid-cols-12 md:gap-6 md:px-10 md:py-20">
            <div className={flip ? "md:order-2 md:col-span-7" : "md:col-span-7"}>
              <ImageReveal>
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory md:aspect-[4/5]">
                  {image ? <Media src={image.src} alt={image.alt} position={image.position} sizes="(min-width: 768px) 58vw, 100vw" /> : null}
                </div>
              </ImageReveal>
            </div>
            <div className={flip ? "md:order-1 md:col-span-4" : "md:col-span-4 md:col-start-9"}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone">{product.category}</p>
              <h2 className="mt-3 font-serif text-5xl leading-[0.95] md:text-6xl">{product.name}</h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-stone">{product.description}</p>
              <p className="mt-6 text-sm">{formatPrice(product.price)}</p>
              <Link href={`/shop/${product.slug}`} className="nav-link mt-8 inline-block text-[11px] uppercase tracking-[0.2em]">
                Découvrir
              </Link>
            </div>
          </article>
        )
      })}
    </section>
  )
}
