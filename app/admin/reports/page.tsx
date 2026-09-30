import { PageTitle } from "@/components/admin/bits"
import { isAdmin } from "@/lib/admin"

const reports = [
  ["sales", "Rapport ventes", "Commandes dont le paiement est validé."],
  ["orders", "Rapport commandes", "Toutes les demandes enregistrées."],
  ["products", "Rapport produits", "Catalogue, prix et stock."],
  ["stock", "Rapport stock", "Variantes, seuils et ruptures."],
  ["customers", "Rapport clients", "Coordonnées issues des commandes et montant encaissé."],
]

export default async function ReportsPage() {
  if (!(await isAdmin())) return null
  return (
    <div>
      <PageTitle title="Rapports" text="Export CSV. Le PDF pourra s'ajouter plus tard sur les mêmes données." />
      <ul className="grid gap-4 md:grid-cols-2">
        {reports.map(([kind, title, text]) => (
          <li key={kind} className="flex flex-col border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-stone">{text}</p>
            <a href={`/api/admin/export?kind=${kind}`} className="mt-5 inline-block text-xs uppercase tracking-[0.14em]">Télécharger le CSV</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
