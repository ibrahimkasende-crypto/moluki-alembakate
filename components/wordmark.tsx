import { cn } from "@/lib/utils"

export function Wordmark({
  tone = "wine",
  className,
  compact = false,
}: {
  tone?: "wine" | "ivory" | "ink"
  className?: string
  compact?: boolean
}) {
  const color = tone === "ivory" ? "text-ivory" : tone === "ink" ? "text-ink" : "text-wine-deep"
  return (
    <span className={cn("inline-flex items-baseline gap-2 uppercase", color, className)}>
      <span className={cn("font-serif leading-none", compact ? "text-[17px]" : "text-[18px]")}>Moluki</span>
      <span className={cn("font-medium tracking-[0.22em] opacity-70", compact ? "text-[8px]" : "text-[9px]")}>Alembakate</span>
    </span>
  )
}
