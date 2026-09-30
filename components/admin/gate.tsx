"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Wordmark } from "@/components/wordmark"

export function AdminGate() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      setError("Mot de passe refusé.")
      return
    }
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f3f1ec] px-5 py-16 text-ink">
      <div className="mx-auto max-w-md border border-line bg-white p-8">
        <Link href="/" aria-label="Moluki Alembakate, accueil">
          <Wordmark />
        </Link>
        <h1 className="mt-8 font-serif text-4xl">Administration</h1>
        <p className="mt-3 text-sm text-stone">Centre de contrôle de la maison. Le paiement en ligne n&apos;est pas connecté.</p>
        <form onSubmit={submit} className="mt-8">
          <label className="block text-sm">
            Compte
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-line px-3 py-3 outline-none" />
          </label>
          <label className="mt-4 block text-sm">
            Mot de passe
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-line px-3 py-3 outline-none" />
          </label>
          {error ? <p className="mt-3 text-sm text-wine">{error}</p> : null}
          <button type="submit" className="mt-6 bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-ivory">
            Entrer
          </button>
        </form>
        <Link href="/" className="mt-6 inline-block text-sm text-stone">
          Voir la boutique
        </Link>
      </div>
    </main>
  )
}
