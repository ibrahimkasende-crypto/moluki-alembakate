"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { deliveryFee, deliveryLabel, formatPrice } from "@/lib/format"
import type { DeliveryMethod } from "@/lib/types"

const countries = ["France", "Belgique", "Suisse", "Cameroun", "Congo", "Côte d'Ivoire", "Sénégal", "Autre"]

export function CheckoutForm() {
  const { items, subtotal, clear, ready } = useCart()
  const router = useRouter()
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const shipping = deliveryFee(delivery, subtotal)

  if (!ready) return <p className="px-5 pt-32 text-sm text-stone">Chargement du panier…</p>
  if (items.length === 0) {
    return (
      <div className="px-5 pb-24 pt-32 md:px-12">
        <h1 className="font-serif text-5xl">Commande</h1>
        <p className="mt-4 text-stone">Le panier est vide.</p>
      </div>
    )
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: String(form.get("firstName") || ""),
          lastName: String(form.get("lastName") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
        },
        address: {
          line1: String(form.get("line1") || ""),
          city: String(form.get("city") || ""),
          postalCode: String(form.get("postalCode") || ""),
          country: String(form.get("country") || ""),
        },
        delivery,
        note: String(form.get("note") || ""),
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
      }),
    })
    const data = (await response.json()) as { orderId?: string; error?: string }
    setPending(false)
    if (!response.ok || !data.orderId) {
      setError(data.error || "La demande n'a pas pu être enregistrée.")
      return
    }
    clear()
    router.push(`/checkout/confirmation?order=${data.orderId}`)
  }

  return (
    <form onSubmit={submit} className="grid gap-12 px-5 pb-24 pt-28 md:px-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-10">
        <header>
          <h1 className="font-serif text-5xl md:text-6xl">Commande</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone">
            La demande est enregistrée pour la maison. Aucun paiement n&apos;est prélevé : le règlement sera branché plus tard.
          </p>
        </header>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em]">Informations</legend>
          <Field name="firstName" label="Prénom" />
          <Field name="lastName" label="Nom" />
          <Field name="email" label="E-mail" type="email" className="sm:col-span-2" />
          <Field name="phone" label="Téléphone" type="tel" className="sm:col-span-2" />
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-[11px] uppercase tracking-[0.18em]">Adresse</legend>
          <Field name="line1" label="Adresse" className="sm:col-span-2" />
          <Field name="postalCode" label="Code postal" />
          <Field name="city" label="Ville" />
          <label className="text-sm sm:col-span-2">
            Pays
            <select name="country" required defaultValue="France" className="mt-2 w-full border border-line bg-transparent px-3 py-3">
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
        </fieldset>
        <fieldset>
          <legend className="text-[11px] uppercase tracking-[0.18em]">Livraison</legend>
          <div className="mt-4 grid gap-3">
            <DeliveryChoice value="standard" current={delivery} onChange={setDelivery} label="Standard" detail={subtotal >= 250 ? "Offerte" : "12 €"} />
            <DeliveryChoice value="express" current={delivery} onChange={setDelivery} label="Express" detail="18 € — délai confirmé par la maison" />
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[11px] uppercase tracking-[0.18em]">Paiement</legend>
          <div className="mt-4 border border-ink px-4 py-4">
            <p className="text-sm">Paiement en ligne — à connecter</p>
            <p className="mt-2 text-sm text-stone">Aucun prestataire n&apos;est relié. La commande reste en attente de règlement, sans encaissement simulé.</p>
          </div>
        </fieldset>
        <label className="block text-sm">
          Note pour la maison
          <textarea name="note" rows={3} className="mt-2 w-full border border-line bg-transparent px-3 py-3" />
        </label>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <button type="submit" disabled={pending} className="bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-ivory disabled:opacity-50">
          {pending ? "Enregistrement…" : "Enregistrer la demande"}
        </button>
      </div>
      <aside className="h-fit border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Résumé</p>
        <ul className="mt-6 space-y-4 text-sm">
          {items.map((item) => (
            <li key={item.lineId} className="flex justify-between gap-4">
              <span>
                {item.name}
                <span className="block text-xs text-stone">{item.color} · {item.size} · {item.quantity}</span>
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>{deliveryLabel(delivery)}</span><span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between font-medium"><span>Total estimé</span><span>{formatPrice(subtotal + shipping)}</span></div>
        </div>
      </aside>
    </form>
  )
}

function Field({ name, label, type = "text", className = "" }: { name: string; label: string; type?: string; className?: string }) {
  return (
    <label className={`text-sm ${className}`}>
      {label}
      <input name={name} type={type} required className="mt-2 w-full border border-line bg-transparent px-3 py-3" />
    </label>
  )
}

function DeliveryChoice({
  value,
  current,
  onChange,
  label,
  detail,
}: {
  value: DeliveryMethod
  current: DeliveryMethod
  onChange: (value: DeliveryMethod) => void
  label: string
  detail: string
}) {
  return (
    <label className={`flex cursor-pointer items-center justify-between border px-4 py-3 ${current === value ? "border-ink" : "border-line"}`}>
      <span className="flex items-center gap-3 text-sm">
        <input type="radio" name="delivery" checked={current === value} onChange={() => onChange(value)} />
        {label}
      </span>
      <span className="text-sm text-stone">{detail}</span>
    </label>
  )
}
