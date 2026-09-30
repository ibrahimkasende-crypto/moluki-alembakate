import Link from "next/link"
import { isAdmin } from "@/lib/admin"
import { ConfirmButton } from "@/components/admin/confirm"
import { EmptyState, PageTitle, money } from "@/components/admin/bits"
import { productsRepository } from "@/lib/repositories/products"

export const dynamic = "force-dynamic"

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!(await isAdmin())) return null
  const query = await searchParams
  const q = (query.q || "").trim().toLowerCase()
  const products = productsRepository.list().filter((product) => !q || `${product.name} ${product.category} ${product.sku ?? ""}`.toLowerCase().includes(q))

  return (
    <div>
      <PageTitle title="Catalogue" text="Prix, images, variantes et mise en avant. Une pièce archivée disparaît de la boutique.">
        <Link href="/admin/products/new" className="bg-ink px-3 py-2 text-xs uppercase tracking-[0.12em] text-ivory">Nouveau produit</Link>
        <Link href="/admin/categories" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Catégories</Link>
        <Link href="/admin/collections" className="bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">Collections</Link>
      </PageTitle>
      <form action="/admin/products" className="mb-4">
        <input name="q" defaultValue={query.q || ""} placeholder="Rechercher une pièce" className="border border-line bg-white px-3 py-2 text-sm" />
      </form>
      {products.length ? (
        <div className="space-y-3">
          {products.map((product) => (
            <article key={product.id} className="grid items-center gap-4 border border-line bg-white p-4 md:grid-cols-[72px_minmax(0,1fr)_auto]">
              {product.images[0] ? <img src={product.images[0].src} alt="" className="h-20 w-16 object-cover" /> : <span className="h-20 w-16 bg-paper" />}
              <div className="min-w-0 text-sm">
                <Link href={`/admin/products/${product.id}`} className="font-medium">{product.name}</Link>
                <p className="mt-1 text-stone">{product.category} · {money(product.price)} · stock {product.stock}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone">{product.archived ? "Archivé" : "Actif"}{product.featured ? " · Vedette" : ""}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/admin/products/${product.id}`} className="text-xs uppercase tracking-[0.12em]">Modifier</Link>
                <ConfirmButton label="Dupliquer" message={`Dupliquer ${product.name} ?`} request={{ url: "/api/admin/products", body: { action: "duplicate", id: product.id } }} />
                <ConfirmButton label={product.archived ? "Réactiver" : "Archiver"} message={product.archived ? `Réactiver ${product.name} ?` : `Voulez-vous vraiment archiver ${product.name} ?`} request={{ url: "/api/admin/products", body: { action: "archive", id: product.id } }} />
                <ConfirmButton label="Supprimer" tone="danger" message={`Retirer ${product.name} du catalogue ?`} request={{ url: `/api/admin/products?id=${product.id}`, method: "DELETE" }} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucune pièce." text="Le catalogue de base est vide pour cette recherche." />
      )}
    </div>
  )
}
