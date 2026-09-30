"use client"

import Link from "next/link"
import { useState } from "react"
import { Media } from "@/components/media"
import { homeStills } from "@/lib/media"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!response.ok) {
      setError("Indiquez une adresse valide.")
      return
    }
    setDone(true)
  }

  return (
    <section aria-label="Contact">
      <div className="relative min-h-[78svh] overflow-hidden bg-ink text-ivory">
        <Media src={homeStills.complet} alt="" sizes="100vw" />
        <div className="scrim-bottom" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 py-16 md:px-14">
          <p className="font-serif text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.86]">Moluki Alembakate</p>
          <p className="mt-4 text-[12px] uppercase tracking-[0.28em] text-ivory/80">Découvrir la collection</p>
          <Link href="/shop" className="btn-pill mt-8 w-fit bg-ivory text-ink">
            Boutique
          </Link>
        </div>
      </div>
      <div className="shell section-space">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Correspondance</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl">La maison écrit peu.</h2>
        {done ? (
          <p className="mt-8 text-sm">Adresse notée.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="sr-only">Adresse e-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Votre e-mail"
                className="w-full border-b border-ink bg-transparent py-3 outline-none"
              />
            </label>
            <button type="submit" className="btn-pill bg-ink text-ivory">
              S&apos;inscrire
            </button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
        <Link href="/contact" className="nav-link mt-8 inline-block text-[11px] uppercase tracking-[0.18em]">
          Écrire à la maison
        </Link>
      </div>
    </section>
  )
}
