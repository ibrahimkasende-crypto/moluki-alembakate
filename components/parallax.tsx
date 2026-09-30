"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

export function Parallax({
  children,
  className,
  amount = 8,
}: {
  children: React.ReactNode
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`${amount}%`, `${-amount}%`])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
        {children}
      </motion.div>
    </div>
  )
}
