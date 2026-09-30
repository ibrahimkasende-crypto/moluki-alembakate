"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function ConfirmButton({
  label,
  message,
  request,
  tone = "ghost",
}: {
  label: string
  message: string
  request: { url: string; method?: string; body?: unknown }
  tone?: "ghost" | "danger"
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function run() {
    setPending(true)
    await fetch(request.url, {
      method: request.method || "POST",
      headers: request.body ? { "Content-Type": "application/json" } : undefined,
      body: request.body ? JSON.stringify(request.body) : undefined,
    })
    setPending(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button type="button" className={`text-xs uppercase tracking-[0.12em] ${tone === "danger" ? "text-wine" : "text-ink"}`} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" role="dialog" aria-modal="true" aria-label={message}>
          <div className="w-full max-w-md bg-white p-6">
            <p className="text-lg">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm" onClick={() => setOpen(false)}>
                Annuler
              </button>
              <button type="button" disabled={pending} className="bg-ink px-4 py-2 text-sm text-ivory disabled:opacity-50" onClick={run}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
