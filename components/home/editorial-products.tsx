import Link from "next/link"
import { ArrowIcon } from "@/components/icons"
import { Media } from "@/components/media"
import { FadeIn, ImageReveal } from "@/components/motion"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"

const variants = ["left", "right", "center"] as const

export function EditorialProducts({ products }: { products: Product[] }) {
  return (
    <section className="section-space bg-paper" aria-label="Pièces choisies">
      <div className="shell">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Pièces</p>
      </div>
      <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
        {products.map((product, index) => {
          const image = product.images[0]
          const flip = index % 2 === 1
          return (
            <article key={product.id} className="shell grid items-center gap-8 md:grid-cols-12 md:gap-10">
              <div className={flip ? "md:order-2 md:col-span-7" : "md:col-span-7"}>
                <div data-explore="Voir" className="relative aspect-[3/4] overflow-hidden bg-ivory md:aspect-[4/5]">
                  <ImageReveal variant={variants[index % variants.length]}>
                    {image ? <Media src={image.src} alt={image.alt} position={image.position} sizes="(min-width: 768px) 55vw, 100vw" className="img-zoom" /> : null}
                  </ImageReveal>
                </div>
              </div>
              <FadeIn className={flip ? "md:order-1 md:col-span-4" : "md:col-span-4 md:col-start-9"} delay={0.08}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone">{product.category}</p>
                <h3 className="mt-3 font-serif text-4xl leading-[0.95] md:text-6xl">{product.name}</h3>
                <p className="mt-6 text-sm">{formatPrice(product.price)}</p>
                <Link href={`/shop/${product.slug}`} className="nav-link group mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                  Voir la pièce
                  <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </FadeIn>
            </article>
          )
        })}
      </div>
    </section>
  )
}
