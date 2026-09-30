import { Media } from "@/components/media"
import { cn } from "@/lib/utils"

function PhotoMark({
  src,
  alt,
  position = "center",
  imageClassName,
  className,
}: {
  src: string
  alt: string
  position?: string
  imageClassName?: string
  className?: string
}) {
  return (
    <span className={cn("relative block h-24 w-24 overflow-hidden bg-ivory md:h-28 md:w-28", className)}>
      <Media src={src} alt={alt} position={position} sizes="112px" crop={false} className={imageClassName} />
    </span>
  )
}

export function SignatureIcon({ className }: { className?: string }) {
  return (
    <PhotoMark
      src="/media/brand/wordmark.jpg"
      alt=""
      position="50% 56%"
      imageClassName="origin-[50%_56%] scale-[2.8]"
      className={className}
    />
  )
}

export function CraftIcon({ className }: { className?: string }) {
  return <PhotoMark src="/media/editorial/detail-couture.jpg" alt="" position="72% 42%" className={className} />
}

export function StyleIcon({ className }: { className?: string }) {
  return <PhotoMark src="/media/editorial/look-a.jpg" alt="" position="center 16%" className={className} />
}

export function MovementIcon({ className }: { className?: string }) {
  return <PhotoMark src="/media/editorial/world-b.jpg" alt="" position="center 28%" className={className} />
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-3.5 w-3.5", className)} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 12h15" />
      <path d="M13 6.5 19 12l-6 5.5" />
    </svg>
  )
}
