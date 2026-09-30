"use client"

import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/format"
import type { Order, OrderStatus, Product } from "@/lib/types"

export function AdminConsole() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  async function load() {
    const [productResponse, orderResponse] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/orders")])
    if (productResponse.status === 401 || orderResponse.status === 401) {
      setAuthed(false)
      setReady(true)
      return
    }
    setProducts((await productResponse.json()) as Product[])
    setOrders((await orderResponse.json()) as Order[])
    setAuthed(true)
    setReady(true)
  }

  useEffect(() => {
    let ignore = false
    Promise.all([fetch("/api/admin/products"), fetch("/api/admin/orders")]).then(async ([productResponse, orderResponse]) => {
      if (ignore) return
      if (productResponse.status === 401 || orderResponse.status === 401) {
        setAuthed(false)
        setReady(true)
        return
      }
      setProducts((await productResponse.json()) as Product[])
      setOrders((await orderResponse.json()) as Order[])
      setAuthed(true)
      setReady(true)
    })
    return () => {
      ignore = true
    }
  }, [])

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (!response.ok) {
      setError("Mot de passe refusé.")
      return
    }
    await load()
  }

  async function save(product: Product) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    await load()
  }

  async function setStatus(id: string, status: OrderStatus) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    await load()
  }

  if (!ready) return <p className="px-5 pt-10 text-sm text-stone">Ouverture de l&apos;atelier…</p>

  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto max-w-md px-5 py-24">
        <p className="font-serif text-5xl">Atelier</p>
        <p className="mt-4 text-sm text-stone">Espace de la maison. Les commandes et les pièces restent sur cette installation.</p>
        <label className="mt-8 block text-sm">
          Mot de passe
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-line bg-transparent px-3 py-3" />
        </label>
        {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
        <button type="submit" className="mt-6 bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">
          Entrer
        </button>
      </form>
    )
  }

  return (
    <div className="px-5 py-10 md:px-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Atelier</p>
          <h1 className="font-serif text-5xl">Moluki Alembakate</h1>
        </div>
        <button
          type="button"
          className="text-[11px] uppercase tracking-[0.16em]"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" })
            setAuthed(false)
          }}
        >
          Sortir
        </button>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-stone">
        Prix, stock, mise en avant et commandes. Le paiement n&apos;est pas connecté : une commande ne passe jamais au statut payé depuis cet écran.
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-4xl">Pièces</h2>
        <div className="mt-6 divide-y divide-line">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onSave={save} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-4xl">Commandes</h2>
        {orders.length === 0 ? <p className="mt-4 text-sm text-stone">Aucune demande pour le moment.</p> : null}
        <ul className="mt-6 space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border-t border-line pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-serif text-2xl">{order.id}</p>
                <p className="text-sm">{formatPrice(order.total)}</p>
              </div>
              <p className="mt-1 text-sm text-stone">
                {order.customer.firstName} {order.customer.lastName} · {order.customer.email} · {order.customer.phone}
              </p>
              <p className="text-sm text-stone">
                {order.address.line1}, {order.address.postalCode} {order.address.city}, {order.address.country}
              </p>
              <p className="mt-2 text-sm">{order.items.map((item) => `${item.name} (${item.size}) × ${item.quantity}`).join(" · ")}</p>
              <label className="mt-3 block text-sm">
                Statut
                <select value={order.status} onChange={(event) => setStatus(order.id, event.target.value as OrderStatus)} className="ml-3 border border-line bg-transparent px-2 py-1">
                  <option value="pending_payment">En attente de paiement</option>
                  <option value="preparing">En préparation</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function ProductRow({ product, onSave }: { product: Product; onSave: (product: Product) => Promise<void> }) {
  const [draft, setDraft] = useState(product)
  return (
    <form
      className="grid gap-3 py-5 md:grid-cols-[1.4fr_repeat(4,minmax(0,0.5fr))_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        void onSave(draft)
      }}
    >
      <div>
        <p className="font-serif text-2xl">{product.name}</p>
        <p className="text-xs uppercase tracking-[0.14em] text-stone">{product.category}</p>
      </div>
      <label className="text-xs text-stone">
        Prix
        <input type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} className="mt-1 w-full border border-line bg-transparent px-2 py-2" />
      </label>
      <label className="text-xs text-stone">
        Stock
        <input type="number" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} className="mt-1 w-full border border-line bg-transparent px-2 py-2" />
      </label>
      <label className="text-xs text-stone md:col-span-2">
        Image
        <input value={draft.images[0]?.src ?? ""} onChange={(event) => setDraft({ ...draft, images: [{ ...draft.images[0], src: event.target.value, alt: draft.images[0]?.alt ?? draft.name }, ...draft.images.slice(1)] })} className="mt-1 w-full border border-line bg-transparent px-2 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
        Choix
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.isNew} onChange={(event) => setDraft({ ...draft, isNew: event.target.checked })} />
        Nouveau
      </label>
      <button type="submit" className="self-end border border-ink px-3 py-2 text-[11px] uppercase tracking-[0.14em]">
        Enregistrer
      </button>
    </form>
  )
}
