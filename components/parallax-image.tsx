import { CampaignImage } from "@/components/campaign-image"
import { ImageReveal } from "@/components/image-reveal"
import { Parallax } from "@/components/parallax"
import { cn } from "@/lib/utils"

export function ParallaxImage({
  id,
  className,
  amount = 6,
  priority = false,
  sizes = "100vw",
  reveal = true,
}: {
  id: string
  className?: string
  amount?: number
  priority?: boolean
  sizes?: string
  reveal?: boolean
}) {
  const frame = (
    <Parallax className={cn("h-[70vh] min-h-[440px] md:h-[86vh]", className)} amount={amount}>
      <CampaignImage id={id} priority={priority} sizes={sizes} className="h-full" />
    </Parallax>
  )
  if (!reveal) return frame
  return <ImageReveal>{frame}</ImageReveal>
}
