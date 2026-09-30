import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { TaxonomyForm } from "@/components/admin/panels"
import { taxonomyRepository } from "@/lib/repositories/taxonomy"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  if (!(await isAdmin())) return null
  return (
    <div>
      <PageTitle title="Catégories" text="Les nouvelles catégories sont enregistrées ici. La boutique publique lit encore le catalogue de base." />
      <TaxonomyForm kind="categories" items={taxonomyRepository.categories()} />
    </div>
  )
}
