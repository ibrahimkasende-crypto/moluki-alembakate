"use client"

import { motion, useReducedMotion } from "motion/react"
import { PenLine, Scissors, Shirt, Wind } from "lucide-react"
import { Media } from "@/components/media"
import { TextReveal } from "@/components/motion"
import { maisonPillars } from "@/lib/media"
import { duration, ease } from "@/lib/motion"

const icons = {
  signature: PenLine,
  "savoir-faire": Scissors,
  silhouette: Shirt,
  mouvement: Wind,
} as const

export function Intro() {
  const reduce = useReducedMotion()

  return (
    <section id="marque" className="bg-paper">
      <div className="shell section-space text-center">
        <motion.p
          className="text-[11px] uppercase tracking-[0.28em] text-stone"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: duration.fast, ease }}
        >
          La maison
        </motion.p>
        <TextReveal
          text="Moluki Alembakate"
          className="mx-auto mt-6 max-w-5xl font-serif text-[clamp(2.4rem,8vw,5.6rem)] uppercase leading-[0.9]"
        />
        <motion.p
          className="mx-auto mt-6 max-w-[16rem] text-base leading-relaxed text-stone"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: duration.medium, delay: 0.12, ease }}
        >
          Une maison masculine.
          <br />
          La coupe suffit.
        </motion.p>
        <ul className="mx-auto mt-16 grid max-w-sm grid-cols-1 gap-12 sm:max-w-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          {maisonPillars.map((pillar, index) => {
            const Icon = icons[pillar.id]
            return (
              <motion.li
                key={pillar.id}
                className="group flex flex-col items-center"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: duration.medium, delay: reduce ? 0 : 0.08 + index * 0.1, ease }}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
                  <Media
                    src={pillar.src}
                    alt={pillar.alt}
                    position={pillar.position}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="img-zoom"
                  />
                </div>
                <Icon
                  aria-hidden
                  strokeWidth={1.25}
                  className="mt-5 h-4 w-4 text-wine transition-transform duration-700 ease-out group-hover:-translate-y-0.5 motion-reduce:transform-none"
                />
                <span className="mt-3 text-[11px] uppercase tracking-[0.22em]">{pillar.label}</span>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
