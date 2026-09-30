import { Media } from "@/components/media"
import { ImageReveal } from "@/components/motion"
import { homeStills } from "@/lib/media"

const shots = [
  { src: homeStills.col, label: "Détail 01", variant: "up" as const },
  { src: homeStills.couture, label: "Détail 02", variant: "left" as const },
  { src: homeStills.finition, label: "Détail 03", variant: "right" as const },
]

export function Details() {
  return (
    <section className="section-space bg-ivory" aria-label="Détails">
      <div className="shell">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">Les détails</p>
        <div className="mt-16 space-y-16 md:mt-24 md:space-y-28">
          {shots.map((shot) => (
            <figure key={shot.label}>
              <figcaption className="mb-4 text-[11px] uppercase tracking-[0.22em] text-stone">{shot.label}</figcaption>
              <div className="relative aspect-[4/5] overflow-hidden bg-paper md:aspect-[16/9]">
                <ImageReveal variant={shot.variant}>
                  <Media src={shot.src} alt={shot.label} sizes="(min-width: 768px) 90vw, 100vw" className="img-zoom" />
                </ImageReveal>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
