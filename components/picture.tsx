import { Media } from "@/components/media"
import type { MediaAsset } from "@/lib/media"
import { cn } from "@/lib/utils"

export function Picture({
  asset,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
  zoom = false,
}: {
  asset: MediaAsset
  priority?: boolean
  sizes?: string
  className?: string
  zoom?: boolean
}) {
  if (asset.placeholder || !asset.src) {
    return (
      <div
        data-media-id={asset.id}
        data-origin={asset.origin}
        data-awaiting-shoot="true"
        className={cn("flex h-full min-h-[220px] w-full flex-col justify-end bg-ivory p-6", className)}
      >
        <p className="font-serif text-3xl leading-none text-ink/80">{asset.title}</p>
        <p className="mt-4 max-w-[12rem] text-[10px] uppercase leading-relaxed tracking-[0.22em] text-stone">
          Shooting à venir
          <span className="mt-2 block tracking-[0.14em]">{asset.category}/{asset.id}</span>
        </p>
      </div>
    )
  }

  return (
    <Media
      src={asset.src}
      alt={asset.alt}
      position={asset.position}
      priority={priority}
      sizes={sizes}
      crop={asset.crop}
      className={cn(zoom && "img-zoom", className)}
    />
  )
}
