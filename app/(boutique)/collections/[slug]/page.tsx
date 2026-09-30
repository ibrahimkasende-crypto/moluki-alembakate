import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ProductCard } from "@/components/product-card"
import { collections } from "@/lib/catalog"
import { getAllProducts } from "@/lib/inventory"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const collection = collections.find((item) => item.slug === slug)
  if (!collection) return { title: "Collection" }
  return { title: collection.name, description: collection.text }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = collections.find((item) => item.slug === slug)
  if (!collection) notFound()
  const products = getAllProducts().filter((product) => product.collection === collection.slug)
  return (
    <>
      <PageHeader kicker="Collection" title={collection.name} text={collection.text} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 px-5 pb-20 md:px-12 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
