import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { ProductForm } from "@/components/admin/product-form"
import { taxonomyRepository } from "@/lib/repositories/taxonomy"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  if (!(await isAdmin())) return null
  const categories = taxonomyRepository.categories().filter((item) => item.status === "active")
  const collections = taxonomyRepository.collections().filter((item) => item.status === "active")
  return (
    <div>
      <PageTitle title="Nouveau produit" text="La pièce reste invisible tant qu'elle n'est pas enregistrée." />
      <ProductForm product={null} categories={categories} collections={collections} />
    </div>
  )
}
