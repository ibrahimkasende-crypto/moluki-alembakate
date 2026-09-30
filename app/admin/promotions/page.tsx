import { EmptyState, PageTitle, when } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { CampaignForm, PromotionForm } from "@/components/admin/panels"
import { productsRepository } from "@/lib/repositories/products"
import { promotionsRepository } from "@/lib/repositories/promotions"

export const dynamic = "force-dynamic"

export default async function PromotionsPage() {
  if (!(await isAdmin())) return null
  const promotions = promotionsRepository.list()
  const campaigns = promotionsRepository.campaigns()
  const products = productsRepository.list()
  const now = Date.now()

  return (
    <div className="space-y-10">
      <PageTitle title="Promotions" text="Les codes sont enregistrés. Ils ne sont pas encore appliqués au paiement de la boutique." />
      <PromotionForm />
      {promotions.length ? (
        <ul className="divide-y divide-line border border-line bg-white text-sm">
          {promotions.map((promo) => {
            const ended = promo.endsAt && new Date(promo.endsAt).getTime() < now
            return (
              <li key={promo.id} className="flex flex-wrap justify-between gap-2 px-4 py-3">
                <span className="font-medium">{promo.code}</span>
                <span>{promo.kind === "percent" ? `-${promo.value} %` : `-${promo.value} €`} · min {promo.minAmount} € · {ended ? "Terminée" : promo.status === "active" ? "Active" : "En pause"}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState title="Aucun code." text="Créez un code lorsque vous voulez préparer une offre. Rien n'est inventé." />
      )}
      <section>
        <h2 className="mb-3 font-serif text-2xl">Offres</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">Campagnes préparées pour plus tard : lancement, soldes, collection limitée. Elles n&apos;apparaissent pas encore sur le site public.</p>
        <CampaignForm products={products} />
        <ul className="mt-4 divide-y divide-line border border-line bg-white text-sm">
          {campaigns.length ? campaigns.map((campaign) => (
            <li key={campaign.id} className="px-4 py-3">
              <p className="font-medium">{campaign.title}</p>
              <p className="text-stone">{campaign.status} · {campaign.startsAt ? when(campaign.startsAt) : "sans date"}</p>
            </li>
          )) : <li className="px-4 py-6 text-stone">Aucune offre.</li>}
        </ul>
      </section>
    </div>
  )
}
