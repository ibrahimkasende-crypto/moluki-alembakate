"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { Frame } from "@/components/frame"
import { visuals } from "@/lib/visuals"

export function Silhouette() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"])
  const reveal = useTransform(scrollYProgress, [0.15, 0.4], [0, 1])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink text-ivory">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        <Frame visual={visuals.silhouette} sizes="100vw" />
      </motion.div>
      <div className="scrim-bottom" />
      <motion.div style={{ opacity: reduce ? 1 : reveal }} className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 py-16 md:justify-center md:px-16">
        <p className="text-[11px] uppercase tracking-[0.28em]">The Moluki man</p>
        <p className="mt-6 max-w-sm font-serif text-4xl leading-tight md:text-6xl">
          Confident.
          <span className="block">Contemporary.</span>
          <span className="block">Unmistakable.</span>
        </p>
      </motion.div>
    </section>
  )
}
