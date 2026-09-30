"use client"

import { motion, useReducedMotion } from "motion/react"
import { duration, ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

const view = { once: true, amount: 0.28 } as const

export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={view}
      transition={{ duration: duration.medium, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={view}
      transition={{ duration: duration.medium, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={view}
      transition={{ duration: duration.slow, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

const clips = {
  up: "inset(18% 0% 0% 0%)",
  left: "inset(0% 16% 0% 0%)",
  right: "inset(0% 0% 0% 16%)",
  center: "inset(9% 9% 9% 9%)",
} as const

export function ImageReveal({
  children,
  variant = "up",
  className,
  delay = 0,
}: {
  children: React.ReactNode
  variant?: keyof typeof clips
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn("absolute inset-0 overflow-hidden", className)}
      initial={reduce ? false : { clipPath: clips[variant], opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={view}
      transition={{ duration: duration.slow, delay, ease }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={view}
        transition={{ duration: duration.slow, delay, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function TextReveal({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p"
}) {
  const reduce = useReducedMotion()
  const words = text.split(" ")
  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={reduce ? false : { y: 22, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={view}
          transition={{ duration: duration.medium, delay: index * 0.07, ease }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </Tag>
  )
}

export function SectionTransition({ from, to }: { from: string; to: string }) {
  return <div aria-hidden className="h-16 w-full" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }} />
}
