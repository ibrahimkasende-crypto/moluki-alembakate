"use client"

import Link from "next/link"
import { useEffect } from "react"
import { motion, useReducedMotion } from "motion/react"
import { nav } from "@/lib/site"
import { Wordmark } from "@/components/wordmark"

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-ivory px-6 pb-10 pt-8"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Moluki Alembakate, accueil"
          onClick={() => {
            if (window.location.pathname === "/") {
              const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
              if (window.location.hash) window.history.pushState(null, "", "/")
            }
            onClose()
          }}
        >
          <Wordmark compact />
        </Link>
        <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-[0.18em]">
          Fermer
        </button>
      </div>
      <nav className="mt-16 flex flex-col gap-5" aria-label="Mobile">
        {nav.map((item, index) => (
          <motion.div
            key={item.href}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.35 }}
          >
            <Link
              href={item.href}
              onClick={() => {
                if (item.href === "/" && window.location.pathname === "/") {
                  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
                  if (window.location.hash) window.history.pushState(null, "", "/")
                }
                onClose()
              }}
              className="font-serif text-4xl leading-none md:text-5xl"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>
      <p className="mt-auto text-[11px] uppercase tracking-[0.2em] text-stone">L&apos;élégance en mouvement.</p>
    </motion.div>
  )
}
