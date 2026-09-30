"use client"

import { useState } from "react"
import { Media } from "@/components/media"
import type { GalleryImage } from "@/lib/types"

export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const current = images[index] ?? images[0]

  return (
    <div>
      <button type="button" className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-ivory" onClick={() => setZoom(true)} aria-label="Agrandir la photo">
        <Media src={current.src} alt={current.alt || name} position={current.position} priority sizes="(min-width: 1024px) 58vw, 100vw" className="img-zoom" />
      </button>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-3">
          {images.map((image, imageIndex) => (
            <button
              key={`${image.src}-${imageIndex}`}
              type="button"
              aria-label={`Photo ${imageIndex + 1}`}
              onClick={() => setIndex(imageIndex)}
              className={`relative aspect-[3/4] w-16 cursor-zoom-in overflow-hidden bg-ivory ${imageIndex === index ? "opacity-100" : "opacity-45"}`}
            >
              <Media src={image.src} alt="" position={image.position} sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
      {zoom ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 p-4" role="dialog" aria-modal="true" aria-label="Photo agrandie">
          <button type="button" className="absolute right-5 top-5 text-[11px] uppercase tracking-[0.18em] text-ivory" onClick={() => setZoom(false)}>
            Fermer
          </button>
          <div className="relative h-[min(88vh,1100px)] w-full max-w-4xl">
            <Media src={current.src} alt={current.alt || name} position={current.position} sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
