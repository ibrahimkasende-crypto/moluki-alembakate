import type { Metadata } from "next"
import { BrandStory } from "@/components/home/brand-story"
import { Categories } from "@/components/home/categories"
import { Details } from "@/components/home/details"
import { EditorialGallery } from "@/components/home/editorial-gallery"
import { EditorialProducts } from "@/components/home/editorial-products"
import { Hero } from "@/components/home/hero"
import { Intro } from "@/components/home/intro"
import { LookbookBand } from "@/components/home/lookbook-band"
import { Newsletter } from "@/components/home/newsletter"
import { Silhouette } from "@/components/home/silhouette"
import { SocialGrid } from "@/components/home/social-grid"
import { getAllProducts } from "@/lib/inventory"
import { site } from "@/lib/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
}

const editorialSlugs = ["tee-shirt-griffe", "chemise-atelier", "complet-marine", "pantalon-ivoire"]

export default function HomePage() {
  const products = getAllProducts()
  const editorial = editorialSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product !== undefined)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: site.name,
    description: site.description,
    url: site.url,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Intro />
      <EditorialGallery />
      <Categories />
      <LookbookBand />
      <Details />
      <Silhouette />
      <EditorialProducts products={editorial} />
      <BrandStory />
      <SocialGrid />
      <Newsletter />
    </>
  )
}
