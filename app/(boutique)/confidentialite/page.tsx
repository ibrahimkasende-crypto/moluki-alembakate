import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = { title: "Confidentialité", description: "Politique de confidentialité Moluki Alembakate." }

export default function PrivacyPage() {
  return (
    <>
      <PageHeader kicker="Maison" title="Confidentialité" />
      <div className="max-w-2xl space-y-5 px-5 pb-24 text-sm leading-relaxed text-stone md:px-12">
        <p>Les informations laissées dans le formulaire de contact, la lettre d&apos;information ou la commande servent uniquement à répondre et à préparer la demande. Elles sont enregistrées sur l&apos;installation du site.</p>
        <p>Le panier et les favoris restent dans le navigateur. Aucun paiement n&apos;est transmis, puisqu&apos;aucun prestataire n&apos;est encore relié.</p>
        <p>Pour consulter ou faire retirer un message, écrivez à la maison via la page contact.</p>
      </div>
    </>
  )
}
