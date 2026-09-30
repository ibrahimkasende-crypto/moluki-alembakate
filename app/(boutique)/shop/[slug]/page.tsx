import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Gallery } from "@/components/gallery"
import { ProductCard } from "@/components/product-card"
import { PurchasePanel } from "@/components/purchase-panel"
import { categories, relatedTo } from "@/lib/catalog"
import { getAllProducts, getProductBySlug } from "@/lib/inventory"
import { formatPrice } from "@/lib/format"
import { site } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Pièce introuvable" }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].src }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  const all = getAllProducts()
  const related = relatedTo(product, all)
  const category = categories.find((item) => item.slug === product.category)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${site.url}${image.src}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/shop/${product.slug}`,
    },
  }

  return (
    <article className="px-5 pb-20 pt-28 md:px-12 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
        <Link href="/shop">Boutique</Link>
        <span className="mx-2 text-metal">/</span>
        <Link href={`/shop?category=${product.category}`}>{category?.name}</Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Gallery images={product.images} name={product.name} />
        <div>
          <h1 className="font-serif text-5xl leading-[0.95] md:text-6xl">{product.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone">{product.description}</p>
          <div className="mt-8">
            <PurchasePanel product={product} whatsapp={site.whatsapp || null} />
          </div>
          <p className="mt-10 max-w-xl text-sm leading-relaxed">{product.details}</p>
          <p className="mt-4 text-xs text-stone">Prix affiché {formatPrice(product.price)}. Les photos de démonstration se remplacent par le shooting de la maison.</p>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif text-4xl md:text-5xl">Dans la même ligne</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
