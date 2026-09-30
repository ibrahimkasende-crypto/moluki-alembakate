"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { CinematicVideo } from "@/components/cinematic-video"
import { ArrowIcon } from "@/components/icons"
import { videos } from "@/lib/media"

export function Hero() {
  const reduce = useReducedMotion()
  const settle = reduce ? { opacity: 1, y: 0 } : undefined
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const veil = useTransform(scrollYProgress, [0.28, 0.92], [0, 1])

  return (
    <section ref={ref} className="relative h-[88svh] min-h-[560px] overflow-hidden bg-ink text-ivory md:h-[100svh] md:min-h-[680px]">
      <div className="absolute inset-0">
        <CinematicVideo src={videos.hero.src} poster={videos.hero.poster} eager className="scale-[1.04]" />
      </div>
      <div className="scrim-bottom" />
      {reduce ? null : (
        <motion.div aria-hidden style={{ opacity: veil }} className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-paper/30 to-paper" />
      )}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 md:px-12 md:pb-16">
        <motion.p
          className="font-serif uppercase leading-[0.78] text-[clamp(3.4rem,12vw,8.4rem)]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={settle ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Moluki
        </motion.p>
        <motion.p
          className="mt-3 text-[12px] uppercase tracking-[0.42em] text-ivory/80"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={settle ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Alembakate
        </motion.p>
        <motion.p
          className="mt-5 text-[11px] uppercase tracking-[0.28em] text-ivory/75"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Élégance en mouvement
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={settle ?? { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link href="/collections/nouvelle-saison" className="btn-pill group mt-6 bg-ivory text-ink">
            Découvrir la collection
            <ArrowIcon className="ml-2 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
      <a
        href="#marque"
        className="absolute bottom-6 right-5 z-10 text-[10px] uppercase tracking-[0.28em] text-ivory/70 md:right-12"
      >
        Défiler
      </a>
    </section>
  )
}
