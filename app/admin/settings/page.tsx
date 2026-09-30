import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"
import { SettingsForm } from "@/components/admin/panels"
import { permissions } from "@/lib/admin/permissions"
import { settingsRepository } from "@/lib/repositories/settings"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  if (!(await isAdmin())) return null
  return (
    <div className="space-y-10">
      <PageTitle title="Paramètres" text="Réglages de la maison. Aucune clé de paiement n'est stockée ici." />
      <section>
        <h2 className="mb-3 font-serif text-2xl">Boutique</h2>
        <SettingsForm settings={settingsRepository.get()} />
      </section>
      <section className="max-w-3xl border border-line bg-white p-5 text-sm">
        <h2 className="font-serif text-2xl">Commandes et livraison</h2>
        <p className="mt-3 text-stone">Standard offerte dès 250 €, sinon 12 €. Express : 18 €. Ces montants restent ceux du checkout public.</p>
      </section>
      <section className="max-w-3xl border border-line bg-white p-5 text-sm">
        <h2 className="font-serif text-2xl">Paiements</h2>
        <p className="mt-3 text-stone">Aucun prestataire n&apos;est connecté. Les commandes restent non facturées. Une clé future devra venir des variables d&apos;environnement, jamais du code.</p>
      </section>
      <section className="max-w-3xl border border-line bg-white p-5 text-sm">
        <h2 className="font-serif text-2xl">Administrateurs</h2>
        <p className="mt-3 text-stone">La session actuelle est propriétaire. Les rôles prévus : propriétaire, admin, manager, éditeur.</p>
        <ul className="mt-3 columns-2 text-stone">
          {permissions.map((permission) => <li key={permission}>{permission}</li>)}
        </ul>
      </section>
    </div>
  )
}
