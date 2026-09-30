"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Frame } from "@/components/frame"
import { visuals } from "@/lib/visuals"

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"])
  const lines = reduce ? { opacity: 1, y: 0 } : undefined

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[120%]">
        <Frame visual={visuals.hero} priority sizes="100vw" className="drift" />
      </motion.div>
      <div className="scrim-bottom" />
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 md:px-14 md:pb-28">
        <motion.p
          className="font-serif uppercase text-ivory"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={lines ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-[clamp(3.15rem,16vw,10.5rem)] leading-[0.78] tracking-[0.04em]">Moluki</span>
        </motion.p>
        <motion.p
          className="mt-3 font-serif uppercase tracking-[0.38em] text-ivory text-[clamp(1.05rem,2.6vw,2rem)]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={lines ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          Alembakate
        </motion.p>
        <motion.p
          className="mt-6 max-w-sm text-[11px] uppercase leading-relaxed tracking-[0.22em] text-ivory/80"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          L&apos;élégance en mouvement.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={lines ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <Link
            href="/collections/nouvelle-saison"
            className="nav-link btn-shift mt-8 inline-flex py-3 text-[11px] uppercase tracking-[0.2em] text-ivory"
          >
            Découvrir la collection
          </Link>
        </motion.div>
      </div>
      <a
        href="#decouverte"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-ivory/75"
      >
        Scroll to discover
      </a>
    </section>
  )
}
