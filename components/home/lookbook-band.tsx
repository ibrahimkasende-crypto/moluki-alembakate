import Link from "next/link"
import { ArrowIcon } from "@/components/icons"
import { CinematicVideo } from "@/components/cinematic-video"
import { Media } from "@/components/media"
import { ImageReveal, TextReveal } from "@/components/motion"
import { homeStills, videos } from "@/lib/media"

const frames = [
  { index: "01", kind: "still" as const, src: homeStills.lookA, variant: "up" as const },
  { index: "02", kind: "video" as const, src: videos.lookbook01.src, poster: videos.lookbook01.poster, variant: "left" as const },
  { index: "03", kind: "video" as const, src: videos.lookbook02.src, poster: videos.lookbook02.poster, variant: "right" as const },
]

export function LookbookBand() {
  return (
    <section className="relative bg-ink text-ivory" aria-label="Lookbook">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-paper to-transparent" />
      <div className="shell pb-8 pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-6">
          <TextReveal text="Lookbook" className="font-serif text-5xl leading-[0.92] md:text-7xl" />
          <Link href="/lookbook" className="nav-link group hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory/70 md:inline-flex">
            Séquence
            <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <div className="space-y-6 px-5 pb-20 md:space-y-10 md:px-12 md:pb-28">
        {frames.map((frame) => (
          <figure key={frame.index} data-explore="Explorer" className="group relative min-h-[78svh] overflow-hidden bg-ink">
            <ImageReveal variant={frame.variant}>
              {frame.kind === "still" ? (
                <Media src={frame.src} alt="" sizes="100vw" className="img-zoom" />
              ) : (
                <CinematicVideo src={frame.src} poster={frame.poster!} />
              )}
            </ImageReveal>
            <figcaption className="pointer-events-none absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.28em] text-ivory/80 md:bottom-10 md:left-10">
              {frame.index}
              <span className="text-ivory/40"> / 03</span>
            </figcaption>
          </figure>
        ))}
        <Link href="/lookbook" className="nav-link group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory/80 md:hidden">
          Séquence
          <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
