"use client"

import { CinematicVideo } from "@/components/cinematic-video"
import { TextReveal } from "@/components/motion"
import { videos } from "@/lib/media"

export function Silhouette() {
  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-ink text-ivory md:min-h-[100svh]" aria-label="Campagne">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-ivory to-transparent" />
      <div className="absolute inset-0">
        <CinematicVideo src={videos.campaign01.src} poster={videos.campaign01.poster} />
      </div>
      <div className="scrim-bottom" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-b from-transparent to-paper" />
      <div className="relative z-10 flex min-h-[88svh] flex-col justify-end px-5 py-20 md:min-h-[100svh] md:px-14">
        <TextReveal text="L'homme Moluki" className="max-w-4xl font-serif text-5xl leading-[0.9] md:text-8xl" />
      </div>
    </section>
  )
}
