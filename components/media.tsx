import Image from "next/image"
import { cn } from "@/lib/utils"

export function Media({
  src,
  alt,
  position = "center",
  priority = false,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  crop,
}: {
  src: string
  alt: string
  position?: string
  priority?: boolean
  className?: string
  sizes?: string
  crop?: boolean
}) {
  const namedHouse = /\/(campagne|silhouette|wordmark|griffe|01-moluki|t-shirts|tee-griffe)\.(jpg|jpeg)$/.test(src)
  const house = crop ?? namedHouse
  const framedPosition = house ? "42% 56%" : position
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={src.endsWith(".svg")}
      className={cn("object-cover", className)}
      style={{ objectPosition: framedPosition }}
    />
  )

  if (!house) return image

  return (
    <span className="house-frame absolute inset-0 block overflow-hidden">
      <span className="house-crop absolute inset-0 block">{image}</span>
    </span>
  )
}
