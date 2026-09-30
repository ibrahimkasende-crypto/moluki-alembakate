import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { ContentForm } from "@/components/admin/panels"
import { contentRepository } from "@/lib/repositories/content"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ContentPage() {
  if (!(await isAdmin())) return null
  return (
    <div>
      <PageTitle title="Contenu" text="Ces champs préparent le hero et l'appel à l'action. La page d'accueil publique ne les lit pas encore.">
        <Link href="/admin/media" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Médias</Link>
      </PageTitle>
      <ContentForm content={contentRepository.get()} />
    </div>
  )
}
