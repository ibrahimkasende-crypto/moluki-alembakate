import { Media } from "@/components/media"
import type { Visual } from "@/lib/visuals"
import { cn } from "@/lib/utils"

export function Frame({
  visual,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
}: {
  visual: Visual
  priority?: boolean
  sizes?: string
  className?: string
}) {
  if (visual.placeholder || !visual.src) {
    return (
      <div
        data-visual-slot={visual.slot}
        data-awaiting-shoot="true"
        className={cn("flex h-full min-h-[240px] w-full items-end bg-[#ebe4d8] p-5", className)}
      >
        <p className="max-w-[14rem] text-[10px] uppercase leading-relaxed tracking-[0.2em] text-stone">
          Visuel en attente
          <span className="mt-2 block tracking-[0.14em] text-stone/80">{visual.slot}</span>
        </p>
      </div>
    )
  }

  return (
    <Media
      src={visual.src}
      alt={visual.alt}
      position={visual.position}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  )
}
