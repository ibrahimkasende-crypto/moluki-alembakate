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
    <span className={cn("font-serif uppercase leading-[0.85]", color, className)}>
      <span className={cn("block tracking-[0.16em]", compact ? "text-[15px]" : "text-[17px]")}>Moluki</span>
      <span className={cn("block tracking-[0.22em]", compact ? "text-[8px]" : "text-[9px]")}>Alembakate</span>
    </span>
  )
}
