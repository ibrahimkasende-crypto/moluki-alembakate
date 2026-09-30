"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { orderFlow, orderStatusLabel } from "@/lib/admin/labels"
import type { Order, OrderStatus } from "@/lib/types"
import type { TaxonomyItem } from "@/lib/repositories/taxonomy"
import type { Campaign, Promotion } from "@/lib/repositories/promotions"
import type { ShopSettings } from "@/lib/repositories/settings"
import type { HomeContent } from "@/lib/repositories/content"
import type { Product } from "@/lib/types"

const field = "mt-2 w-full border border-line bg-white px-3 py-2 text-sm outline-none"

export function OrderPanel({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState(order.internalNote || "")
  const [open, setOpen] = useState(false)

  async function saveStatus() {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    })
    setOpen(false)
    router.refresh()
  }

  async function saveNote() {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, internalNote: note }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-4 border border-line bg-white p-5">
      <label className="block text-sm">
        Statut
        <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className={field}>
          {orderFlow.map((item) => (
            <option key={item} value={item}>
              {orderStatusLabel[item]}
            </option>
          ))}
          <option value="cancelled">Annulée</option>
        </select>
      </label>
      <button type="button" className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-ivory" onClick={() => setOpen(true)}>
        Mettre à jour le statut
      </button>
      <label className="block text-sm">
        Note interne
        <textarea value={note} onChange={(event) => setNote(event.target.value)} className={`${field} min-h-28`} />
      </label>
      <button type="button" className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.14em]" onClick={() => void saveNote()}>
        Enregistrer la note
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white p-6">
            <p>Passer la commande {order.id} au statut « {orderStatusLabel[status]} » ?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)}>Annuler</button>
              <button type="button" className="bg-ink px-4 py-2 text-sm text-ivory" onClick={() => void saveStatus()}>Confirmer</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function StockForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [productId, setProductId] = useState(products[0]?.id || "")
  const [type, setType] = useState("in")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type, quantity, reason }),
    })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-line bg-white p-5 md:grid-cols-4">
      <select value={productId} onChange={(event) => setProductId(event.target.value)} className={field}>
        {products.map((product) => (
          <option key={product.id} value={product.id}>{product.name}</option>
        ))}
      </select>
      <select value={type} onChange={(event) => setType(event.target.value)} className={field}>
        <option value="in">Entrée</option>
        <option value="correction">Correction</option>
        <option value="return">Retour</option>
        <option value="loss">Perte</option>
      </select>
      <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className={field} />
      <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motif" className={field} />
      <button type="submit" className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-ivory md:col-span-4">Enregistrer le mouvement</button>
    </form>
  )
}

export function PromotionForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [kind, setKind] = useState<Promotion["kind"]>("percent")
  const [value, setValue] = useState(10)
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [minAmount, setMinAmount] = useState(0)
  const [maxUses, setMaxUses] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "promotion",
        promotion: { code, kind, value, startsAt, endsAt, minAmount, productIds: [], categories: [], maxUses: maxUses ? Number(maxUses) : null, status: "active" },
      }),
    })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-line bg-white p-5 md:grid-cols-3">
      <input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code" className={field} />
      <select value={kind} onChange={(event) => setKind(event.target.value as Promotion["kind"])} className={field}>
        <option value="percent">Réduction %</option>
        <option value="fixed">Réduction fixe</option>
      </select>
      <input type="number" min={0} value={value} onChange={(event) => setValue(Number(event.target.value))} className={field} />
      <input type="date" required value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={field} />
      <input type="date" required value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={field} />
      <input type="number" min={0} value={minAmount} onChange={(event) => setMinAmount(Number(event.target.value))} placeholder="Minimum" className={field} />
      <input value={maxUses} onChange={(event) => setMaxUses(event.target.value)} placeholder="Utilisations max" className={field} />
      <button type="submit" className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-ivory">Créer le code</button>
    </form>
  )
}

export function CampaignForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [cta, setCta] = useState("Découvrir")
  const [productId, setProductId] = useState(products[0]?.id || "")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const campaign: Omit<Campaign, "id"> = { title, description, image, startsAt, endsAt, cta, productIds: productId ? [productId] : [], status: "draft" }
    await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "campaign", campaign }),
    })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-line bg-white p-5 md:grid-cols-2">
      <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre" className={field} />
      <input value={image} onChange={(event) => setImage(event.target.value)} placeholder="Image" className={field} />
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className={`${field} md:col-span-2`} />
      <input type="date" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={field} />
      <input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={field} />
      <input value={cta} onChange={(event) => setCta(event.target.value)} className={field} />
      <select value={productId} onChange={(event) => setProductId(event.target.value)} className={field}>
        {products.map((product) => (
          <option key={product.id} value={product.id}>{product.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-ivory">Créer l&apos;offre</button>
    </form>
  )
}

export function TaxonomyForm({ kind, items }: { kind: "categories" | "collections"; items: TaxonomyItem[] }) {
  const router = useRouter()
  const [rows, setRows] = useState(items)
  const [name, setName] = useState("")

  function update(index: number, partial: Partial<TaxonomyItem>) {
    setRows((current) => current.map((row, item) => (item === index ? { ...row, ...partial } : row)))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    await fetch("/api/admin/taxonomy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, items: rows }),
    })
    router.refresh()
  }

  return (
    <form onSubmit={save} className="space-y-4">
      {rows.map((row, index) => (
        <div key={row.slug} className="grid gap-2 border border-line bg-white p-4 md:grid-cols-4">
          <input value={row.name} onChange={(event) => update(index, { name: event.target.value })} className={field} />
          <input value={row.description} onChange={(event) => update(index, { description: event.target.value })} className={field} />
          <input type="number" value={row.order} onChange={(event) => update(index, { order: Number(event.target.value) })} className={field} />
          <select value={row.status} onChange={(event) => update(index, { status: event.target.value as TaxonomyItem["status"] })} className={field}>
            <option value="active">Active</option>
            <option value="archived">Archivée</option>
          </select>
        </div>
      ))}
      <div className="flex gap-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nouvelle entrée" className={field} />
        <button
          type="button"
          className="border border-ink px-4 text-xs uppercase tracking-[0.12em]"
          onClick={() => {
            if (!name.trim()) return
            const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
            setRows((current) => [...current, { slug, name, description: "", image: "", order: current.length, status: "active", kind: kind === "categories" ? "category" : "collection" }])
            setName("")
          }}
        >
          Ajouter
        </button>
      </div>
      <button type="submit" className="bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-ivory">Enregistrer</button>
    </form>
  )
}

export function SettingsForm({ settings }: { settings: ShopSettings }) {
  const router = useRouter()
  const [draft, setDraft] = useState(settings)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-4">
      <label className="text-sm">Seuil de stock faible<input type="number" min={0} value={draft.lowStockThreshold} onChange={(event) => setDraft({ ...draft, lowStockThreshold: Number(event.target.value) })} className={field} /></label>
      <label className="text-sm">E-mail de contact<input value={draft.contactEmail} onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })} className={field} /></label>
      <label className="text-sm">Instagram<input value={draft.instagram} onChange={(event) => setDraft({ ...draft, instagram: event.target.value })} className={field} /></label>
      <label className="text-sm">Titre SEO<input value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} className={field} /></label>
      <label className="text-sm">Description SEO<textarea value={draft.seoDescription} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} className={`${field} min-h-24`} /></label>
      <button type="submit" className="bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-ivory">Enregistrer</button>
    </form>
  )
}

export function ContentForm({ content }: { content: HomeContent }) {
  const router = useRouter()
  const [draft, setDraft] = useState(content)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-4">
      <label className="text-sm">Surtitre du hero<input value={draft.heroKicker} onChange={(event) => setDraft({ ...draft, heroKicker: event.target.value })} className={field} /></label>
      <label className="text-sm">Titre du hero<input value={draft.heroTitle} onChange={(event) => setDraft({ ...draft, heroTitle: event.target.value })} className={field} /></label>
      <label className="text-sm">Texte du bouton<input value={draft.heroCta} onChange={(event) => setDraft({ ...draft, heroCta: event.target.value })} className={field} /></label>
      <label className="text-sm">Lien du bouton<input value={draft.heroHref} onChange={(event) => setDraft({ ...draft, heroHref: event.target.value })} className={field} /></label>
      <label className="text-sm">Note de collection<textarea value={draft.featuredNote} onChange={(event) => setDraft({ ...draft, featuredNote: event.target.value })} className={`${field} min-h-24`} /></label>
      <button type="submit" className="bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-ivory">Enregistrer</button>
    </form>
  )
}

export function MediaTools() {
  const router = useRouter()

  async function upload(file: File) {
    const body = new FormData()
    body.set("file", file)
    await fetch("/api/admin/media", { method: "POST", body })
    router.refresh()
  }

  return (
    <label className="inline-block cursor-pointer bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-ivory">
      Déposer un fichier
      <input type="file" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file) }} />
    </label>
  )
}
