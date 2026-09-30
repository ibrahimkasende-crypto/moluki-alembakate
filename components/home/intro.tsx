"use client"

import { motion, useReducedMotion } from "motion/react"

const lines = ["Une manière de s'habiller.", "Une manière de se présenter.", "Une manière d'être."]

export function Intro() {
  const reduce = useReducedMotion()

  return (
    <section id="decouverte" className="px-5 py-28 md:px-14 md:py-44">
      <motion.p
        className="font-serif text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.86] tracking-[0.08em]"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Moluki
        <span className="mt-2 block text-[0.42em] tracking-[0.28em]">Alembakate</span>
      </motion.p>
      <div className="mt-16 max-w-xl space-y-3 md:mt-24">
        {lines.map((line, index) => (
          <motion.p
            key={line}
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
