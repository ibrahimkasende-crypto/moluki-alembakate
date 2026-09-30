"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={cn("h-full w-full", className)}
      initial={{ clipPath: "inset(14% 0% 14% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
