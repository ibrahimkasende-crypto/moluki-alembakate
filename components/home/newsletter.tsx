"use client"

import { useState } from "react"
import { Kicker } from "@/components/page-header"

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
    <section className="border-t border-line px-5 py-20 md:px-12 md:py-28">
      <Kicker index="09">Correspondance</Kicker>
      <h2 className="mt-4 max-w-xl font-serif text-4xl md:text-6xl">Les nouvelles de la maison, sans bruit.</h2>
      {done ? (
        <p className="mt-8 text-sm">Adresse notée. L&apos;envoi des lettres sera branché plus tard.</p>
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
          <button type="submit" className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">
            S&apos;inscrire
          </button>
        </form>
      )}
      {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
    </section>
  )
}
