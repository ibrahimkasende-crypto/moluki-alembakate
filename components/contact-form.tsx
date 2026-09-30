"use client"

import { useState } from "react"

export function ContactForm() {
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    })
    if (!response.ok) {
      setError("Le message n'a pas pu être enregistré.")
      return
    }
    setDone(true)
  }

  if (done) return <p className="font-serif text-4xl">Message reçu. La maison le lira dans l&apos;atelier.</p>

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="text-sm">
        Nom
        <input name="name" required className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none" />
      </label>
      <label className="text-sm">
        E-mail
        <input name="email" type="email" required className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none" />
      </label>
      <label className="text-sm">
        Message
        <textarea name="message" required rows={5} className="mt-2 w-full border-b border-line bg-transparent py-3 outline-none" />
      </label>
      {error ? <p className="text-sm text-wine">{error}</p> : null}
      <button type="submit" className="btn-shift mt-4 self-start bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">
        Envoyer
      </button>
    </form>
  )
}
