import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { TaxonomyForm } from "@/components/admin/panels"
import { taxonomyRepository } from "@/lib/repositories/taxonomy"

export const dynamic = "force-dynamic"

export default async function CollectionsPage() {
  if (!(await isAdmin())) return null
  return (
    <div>
      <PageTitle title="Collections" text="Nouvelle saison, Signature, Essentiels, et les lignes que vous ajoutez. La vitrine publique n'est pas encore branchée sur ces modifications." />
      <TaxonomyForm kind="collections" items={taxonomyRepository.collections()} />
    </div>
  )
}
