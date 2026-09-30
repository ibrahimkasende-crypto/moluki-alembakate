import { ImageReveal } from "@/components/image-reveal"
import { Picture } from "@/components/picture"
import { getMedia, ratios, type MediaRatio } from "@/lib/media"
import { cn } from "@/lib/utils"

export function EditorialImage({
  id,
  ratio,
  priority = false,
  sizes = "(min-width: 1024px) 46vw, 100vw",
  className,
  zoom = true,
  reveal = false,
}: {
  id: string
  ratio?: MediaRatio
  priority?: boolean
  sizes?: string
  className?: string
  zoom?: boolean
  reveal?: boolean
}) {
  const asset = getMedia(id)
  const box = (
    <div
      data-media-id={asset.id}
      data-origin={asset.origin}
      className={cn("group relative overflow-hidden bg-ivory", ratios[ratio ?? asset.ratio], className)}
    >
      <Picture asset={asset} priority={priority} sizes={sizes} zoom={zoom && !asset.placeholder} />
    </div>
  )
  if (!reveal) return box
  return <ImageReveal className="h-full">{box}</ImageReveal>
}
