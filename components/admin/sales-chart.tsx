"use client"

import { useState } from "react"
import type { SalesPoint } from "@/lib/repositories/analytics"
import { formatPrice } from "@/lib/format"

export function SalesChart({ points }: { points: SalesPoint[] }) {
  const [index, setIndex] = useState<number | null>(null)
  if (!points.length) return null
  const width = 640
  const height = 220
  const maxOrders = Math.max(1, ...points.map((point) => point.orders))
  const maxRevenue = Math.max(1, ...points.map((point) => point.revenue))
  const step = width / points.length
  const line = points
    .map((point, i) => {
      const x = i * step + step / 2
      const y = height - 28 - (point.revenue / maxRevenue) * (height - 48)
      return `${i === 0 ? "M" : "L"}${x} ${y}`
    })
    .join(" ")
  const current = index == null ? null : points[index]

  return (
    <div className="border border-line bg-white p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Ventes dans le temps</p>
          <p className="mt-1 text-sm text-stone">Commandes enregistrées et revenus encaissés.</p>
        </div>
        {current ? (
          <p className="text-sm">
            {current.label} · {current.orders} commande{current.orders > 1 ? "s" : ""} · {formatPrice(current.revenue)}
          </p>
        ) : null}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Graphique des ventes">
        {points.map((point, i) => {
          const bar = (point.orders / maxOrders) * (height - 56)
          const x = i * step + step * 0.22
          return (
            <g key={`${point.label}-${i}`} onMouseEnter={() => setIndex(i)} onMouseLeave={() => setIndex(null)}>
              <rect x={x} y={height - 28 - bar} width={step * 0.56} height={bar} fill={index === i ? "#4a1522" : "#111110"} opacity={index === i ? 1 : 0.78} />
            </g>
          )
        })}
        <path d={line} fill="none" stroke="#7a2436" strokeWidth="1.6" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.12em] text-stone">
        <span>{points[0]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  )
}
