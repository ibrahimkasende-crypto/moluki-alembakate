import Link from "next/link"
import { formatPrice } from "@/lib/format"

export function PageTitle({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl leading-none md:text-5xl">{title}</h1>
        {text ? <p className="mt-3 max-w-2xl text-sm text-stone">{text}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  )
}

export function Kpi({ label, value, hint, delta }: { label: string; value: string; hint?: string; delta: number | null }) {
  return (
    <article className="border border-line bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-stone">{label}</p>
      <p className="mt-3 font-serif text-3xl">{value}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-stone">
        <Delta value={delta} />
        {hint ? <span>{hint}</span> : null}
      </div>
    </article>
  )
}

export function Delta({ value }: { value: number | null }) {
  if (value == null || !Number.isFinite(value)) return null
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-1 ${up ? "text-wine" : "text-stone"}`}>
      <svg viewBox="0 0 12 12" aria-hidden className={`h-3 w-3 ${up ? "" : "rotate-180"}`}>
        <path d="M6 9V3M3.5 5.5 6 3l2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {Math.abs(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %
    </span>
  )
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-dashed border-line bg-white px-6 py-14 text-center">
      <svg viewBox="0 0 48 48" aria-hidden className="mx-auto h-10 w-10 text-stone">
        <rect x="8" y="10" width="32" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 18h32M16 10v8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <p className="mt-4 font-serif text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone">{text}</p>
    </div>
  )
}

export function RangeBar({ path, current }: { path: string; current: string }) {
  const items = [
    ["today", "Aujourd'hui"],
    ["7d", "7 jours"],
    ["30d", "30 jours"],
    ["3m", "3 mois"],
    ["12m", "12 mois"],
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([key, label]) => (
        <Link key={key} href={`${path}?range=${key}`} className={`px-3 py-2 text-xs uppercase tracking-[0.12em] ${current === key ? "bg-ink text-ivory" : "bg-white text-ink"}`}>
          {label}
        </Link>
      ))}
    </div>
  )
}

export function GrainBar({ path, range, grain, extra = "" }: { path: string; range: string; grain: string; extra?: string }) {
  const items = [
    ["day", "Jour"],
    ["week", "Semaine"],
    ["month", "Mois"],
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([key, label]) => (
        <Link key={key} href={`${path}?range=${range}&grain=${key}${extra}`} className={`px-3 py-2 text-xs uppercase tracking-[0.12em] ${grain === key ? "bg-ink text-ivory" : "bg-white text-ink"}`}>
          {label}
        </Link>
      ))}
    </div>
  )
}

export function money(value: number) {
  return formatPrice(value)
}

export function when(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
}
