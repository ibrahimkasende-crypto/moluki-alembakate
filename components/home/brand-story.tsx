import Link from "next/link"
import { ArrowIcon } from "@/components/icons"
import { Media } from "@/components/media"
import { FadeIn, ImageReveal, TextReveal } from "@/components/motion"
import { homeStills } from "@/lib/media"

export function BrandStory() {
  return (
    <section className="section-space bg-ivory" aria-label="La maison">
      <div className="shell grid items-end gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5 md:pb-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone">La maison</p>
          <TextReveal text="Le nom se pose." className="mt-5 font-serif text-4xl leading-[0.95] md:text-6xl" />
          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-sm text-base text-stone">Deux lignes, bordeaux sur ivoire.</p>
            <Link href="/about" className="nav-link group mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
              Lire
              <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
        <figure className="relative aspect-[4/5] overflow-hidden md:col-span-6 md:col-start-7">
          <ImageReveal variant="center">
            <Media src={homeStills.house} alt="Wordmark bordeaux Moluki Alembakate sur le jersey ivoire" crop sizes="(min-width: 768px) 45vw, 100vw" />
          </ImageReveal>
        </figure>
      </div>
    </section>
  )
}
