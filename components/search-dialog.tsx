"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={onClose}>
      <form
        role="search"
        className="bg-ivory px-5 py-8 md:px-12"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault()
          const value = query.trim()
          router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop")
          onClose()
        }}
      >
        <label htmlFor="search" className="text-[11px] uppercase tracking-[0.2em] text-stone">
          Rechercher une pièce
        </label>
        <input
          ref={input}
          id="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Chemise, polo, complet…"
          className="mt-4 w-full border-b border-ink bg-transparent py-3 font-serif text-4xl outline-none placeholder:text-line"
        />
        <div className="mt-6 flex gap-6 text-[11px] uppercase tracking-[0.18em]">
          <button type="submit">Voir les résultats</button>
          <button type="button" onClick={onClose} className="text-stone">
            Fermer
          </button>
        </div>
      </form>
    </div>
  )
}
