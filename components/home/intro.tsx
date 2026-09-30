"use client"

import { motion, useReducedMotion } from "motion/react"
import { CraftIcon, MovementIcon, SignatureIcon, StyleIcon } from "@/components/icons"
import { TextReveal } from "@/components/motion"
import { duration, ease } from "@/lib/motion"

const marks = [
  { icon: SignatureIcon, label: "Signature" },
  { icon: CraftIcon, label: "Savoir-faire" },
  { icon: StyleIcon, label: "Silhouette" },
  { icon: MovementIcon, label: "Mouvement" },
]

export function Intro() {
  const reduce = useReducedMotion()

  return (
    <section id="marque" className="relative bg-paper">
      <div className="shell section-space">
        <motion.p
          className="text-[11px] uppercase tracking-[0.28em] text-stone"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: duration.fast, ease }}
        >
          La maison
        </motion.p>
        <TextReveal text="Moluki Alembakate" className="mt-8 max-w-5xl font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] uppercase leading-[0.88]" />
        <motion.p
          className="mt-8 max-w-sm text-base text-stone"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: duration.medium, delay: 0.15, ease }}
        >
          Une maison masculine. La coupe suffit.
        </motion.p>
        <ul className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-28 md:grid-cols-4">
          {marks.map((mark, index) => (
            <motion.li
              key={mark.label}
              className="flex flex-col items-start gap-4 text-ink"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: duration.medium, delay: 0.12 + index * 0.08, ease }}
            >
              <mark.icon />
              <span className="text-[11px] uppercase tracking-[0.22em]">{mark.label}</span>
            </motion.li>
          ))}
        </ul>
        <div aria-hidden className="mx-auto mt-20 h-16 w-px bg-wine/50 md:mt-28" />
      </div>
    </section>
  )
}
