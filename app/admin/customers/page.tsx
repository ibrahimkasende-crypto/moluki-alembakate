import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { EmptyState, PageTitle, money, when } from "@/components/admin/bits"
import { customersRepository } from "@/lib/repositories/customers"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  if (!(await isAdmin())) return null
  const customers = customersRepository.list()
  return (
    <div>
      <PageTitle title="Clients" text="Les fiches viennent des commandes. Aucun compte client supplémentaire n'est créé.">
        <a href="/api/admin/export?kind=customers" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Export CSV</a>
      </PageTitle>
      {customers.length ? (
        <div className="space-y-3">
          {customers.map((customer) => (
            <Link key={customer.id} href={`/admin/customers/${customer.id}`} className="grid gap-2 border border-line bg-white p-4 text-sm md:grid-cols-4">
              <span className="font-medium">{customer.name}</span>
              <span className="text-stone">{customer.email}</span>
              <span>{customer.orders} commande{customer.orders > 1 ? "s" : ""}</span>
              <span>Encaissé {money(customer.spent)} · dernière {when(customer.lastOrderAt)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucun client." text="Un client apparaît lorsqu'une commande réelle est enregistrée." />
      )}
    </div>
  )
}
