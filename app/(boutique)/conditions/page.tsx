import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = { title: "Conditions", description: "Conditions de vente Moluki Alembakate." }

export default function ConditionsPage() {
  return (
    <>
      <PageHeader kicker="Maison" title="Conditions" />
      <div className="max-w-2xl space-y-5 px-5 pb-24 text-sm leading-relaxed text-stone md:px-12">
        <p>Les pièces présentées sont proposées par Moluki Alembakate dans la limite du stock indiqué. Les photographies de démonstration seront remplacées par les images définitives de la maison.</p>
        <p>Une commande passée sur ce site est une demande. Elle n&apos;emporte aucun paiement tant qu&apos;un prestataire n&apos;est pas connecté. La maison confirme la disponibilité, le montant et le mode de règlement avant toute expédition.</p>
        <p>Les délais de livraison sont indicatifs. Les frais affichés au panier sont une estimation, recalculée à l&apos;enregistrement de la demande.</p>
        <p>Le guide des tailles est indicatif. Un essayage ou un échange se traite directement avec la maison.</p>
      </div>
    </>
  )
}
