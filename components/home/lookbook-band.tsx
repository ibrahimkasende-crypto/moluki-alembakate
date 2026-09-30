"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { Media } from "@/components/media"
import { looks } from "@/lib/catalog"

export function LookbookBand() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const look = looks[index]
  const total = String(looks.length).padStart(2, "0")

  return (
    <section className="overflow-hidden bg-ink text-ivory" aria-label="Lookbook">
      <div className="relative min-h-[100svh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={look.id}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Media src={look.image} alt={look.title} position={look.position} sizes="100vw" />
          </motion.div>
        </AnimatePresence>
        <div className="scrim-bottom" />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 py-10 md:px-12 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/80">Lookbook</p>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em]">Look {String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-serif text-[clamp(2.4rem,12vw,7.5rem)] uppercase leading-[0.85] tracking-[0.03em]">{look.title}</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/80">{look.text}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
              <button type="button" onClick={() => setIndex((value) => (value - 1 + looks.length) % looks.length)}>
                Précédent
              </button>
              <button type="button" onClick={() => setIndex((value) => (value + 1) % looks.length)}>
                Suivant
              </button>
              <span>
                {String(index + 1).padStart(2, "0")} / {total}
              </span>
              <Link href={look.href} className="underline underline-offset-4">
                La pièce
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
