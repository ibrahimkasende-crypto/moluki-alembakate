import { EditorialImage } from "@/components/editorial-image"
import { getMedia, type MediaRatio } from "@/lib/media"
import { cn } from "@/lib/utils"

export function DetailImage({
  id,
  ratio,
  className,
  sizes = "(min-width: 768px) 28vw, 50vw",
}: {
  id: string
  ratio?: MediaRatio
  className?: string
  sizes?: string
}) {
  const asset = getMedia(id)
  return (
    <figure className={cn(className)}>
      <EditorialImage id={id} ratio={ratio ?? asset.ratio} sizes={sizes} reveal zoom={false} />
      <figcaption className="mt-3 text-[11px] uppercase tracking-[0.18em] text-stone">{asset.title}</figcaption>
    </figure>
  )
}
