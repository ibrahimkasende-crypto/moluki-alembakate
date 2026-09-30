import type { Metadata } from "next"
import { BrandStory } from "@/components/home/brand-story"
import { Categories } from "@/components/home/categories"
import { Details } from "@/components/home/details"
import { EditorialProducts } from "@/components/home/editorial-products"
import { FeaturedCollection } from "@/components/home/featured-collection"
import { FeaturedShop } from "@/components/home/featured-shop"
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

const spotlightSlugs = ["chemise-atelier", "complet-marine", "tee-shirt-griffe"]
const shopSlugs = ["polo-noir", "pantalon-ivoire", "chemise-nuit", "polo-ivoire", "pantalon-noir", "pochette"]

function pick(slugs: string[]) {
  const products = getAllProducts()
  return slugs.map((slug) => products.find((product) => product.slug === slug)).filter((product) => product !== undefined)
}

export default function HomePage() {
  const spotlight = pick(spotlightSlugs)
  const shop = pick(shopSlugs)
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
      <FeaturedCollection />
      <Categories />
      <LookbookBand />
      <EditorialProducts products={spotlight} />
      <Details />
      <Silhouette />
      <SocialGrid />
      <BrandStory />
      <FeaturedShop products={shop} />
      <Newsletter />
    </>
  )
}
