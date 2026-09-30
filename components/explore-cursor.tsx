"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

export function ExploreCursor() {
  const reduce = useReducedMotion()
  const [state, setState] = useState({ x: 0, y: 0, label: "", on: false })

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches
    if (!fine || reduce) return
    const move = (event: PointerEvent) => {
      const node = (event.target as HTMLElement | null)?.closest("[data-explore]")
      setState({
        x: event.clientX,
        y: event.clientY,
        label: node?.getAttribute("data-explore") || "",
        on: Boolean(node),
      })
    }
    const leave = () => setState((current) => ({ ...current, on: false }))
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerleave", leave)
    }
  }, [reduce])

  if (!state.on) return null

  return (
    <div
      className="pointer-events-none fixed z-[80] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-current px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ivory mix-blend-difference lg:block"
      style={{ left: state.x, top: state.y }}
    >
      {state.label}
    </div>
  )
}
