import { CinematicVideo } from "@/components/cinematic-video"
import { TextReveal } from "@/components/motion"
import { videos } from "@/lib/media"

export function SocialGrid() {
  return (
    <section className="section-space bg-paper" aria-label="Univers Moluki">
      <div className="shell">
        <TextReveal text="L'univers" className="font-serif text-5xl leading-[0.92] md:text-7xl" />
        <figure className="relative mt-12 aspect-[16/9] overflow-hidden md:mt-16">
          <CinematicVideo src={videos.campaign02.src} poster={videos.campaign02.poster} />
        </figure>
      </div>
    </section>
  )
}
