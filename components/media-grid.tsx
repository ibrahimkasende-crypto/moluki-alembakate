import { EditorialImage } from "@/components/editorial-image"
import type { MediaRatio } from "@/lib/media"
import { cn } from "@/lib/utils"

export function MediaGrid({
  items,
  className,
}: {
  items: { id: string; className?: string; ratio?: MediaRatio }[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-4", className)}>
      {items.map((item) => (
        <EditorialImage key={item.id} id={item.id} ratio={item.ratio} sizes="(min-width: 768px) 30vw, 50vw" className={item.className} />
      ))}
    </div>
  )
}
