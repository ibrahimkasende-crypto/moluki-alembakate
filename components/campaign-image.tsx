import { Picture } from "@/components/picture"
import { getMedia, imageSizes } from "@/lib/media"
import { cn } from "@/lib/utils"

export function CampaignImage({
  id,
  priority = false,
  sizes = imageSizes.full,
  className,
  zoom = false,
}: {
  id: string
  priority?: boolean
  sizes?: string
  className?: string
  zoom?: boolean
}) {
  const asset = getMedia(id)
  return (
    <div data-media-id={asset.id} data-origin={asset.origin} className={cn("group relative overflow-hidden bg-ink", className)}>
      <Picture asset={asset} priority={priority} sizes={sizes} zoom={zoom} />
    </div>
  )
}
