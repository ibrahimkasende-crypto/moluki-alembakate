import { notFound } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { PageTitle } from "@/components/admin/bits"
import { ProductForm } from "@/components/admin/product-form"
import { productsRepository } from "@/lib/repositories/products"
import { taxonomyRepository } from "@/lib/repositories/taxonomy"

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return null
  const { id } = await params
  const product = productsRepository.get(id)
  if (!product) notFound()
  return (
    <div>
      <PageTitle title={product.name} text="Le prix public change seulement après confirmation." />
      <ProductForm product={product} categories={taxonomyRepository.categories()} collections={taxonomyRepository.collections()} />
    </div>
  )
}
