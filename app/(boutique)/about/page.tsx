import type { Metadata } from "next"
import { CampaignImage } from "@/components/campaign-image"
import { EditorialImage } from "@/components/editorial-image"

export const metadata: Metadata = {
  title: "La maison",
  description: "Philosophie de Moluki Alembakate : une élégance contemporaine, masculine, tenue par le wordmark.",
}

export default function AboutPage() {
  return (
    <article>
      <CampaignImage id="brand-silhouette" priority sizes="100vw" className="h-[88vh] min-h-[560px]" />
      <div className="px-5 py-24 md:px-14 md:py-36">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">La maison</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl uppercase leading-[0.86] tracking-[0.06em] md:text-8xl">
          Moluki
          <span className="mt-2 block text-[0.38em] tracking-[0.28em]">Alembakate</span>
        </h1>
      </div>
      <div className="px-3 md:px-8">
        <div className="md:ml-auto md:w-[48%]">
          <EditorialImage id="campaign-bordeaux" ratio="3:4" reveal sizes="(min-width: 768px) 48vw, 100vw" />
        </div>
        <div className="mt-12 max-w-md px-2 md:-mt-28 md:ml-[8%] md:px-0">
          <p className="font-serif text-3xl leading-tight md:text-5xl">Le nom se pose. Le reste s&apos;efface.</p>
          <p className="mt-6 text-base leading-relaxed text-stone">
            Deux lignes, bordeaux sur ivoire. La maison coupe, et le vêtement parle.
          </p>
        </div>
      </div>
      <div className="mt-16 px-3 md:mt-8 md:px-8">
        <div className="md:w-[36%]">
          <EditorialImage id="campaign-sable" ratio="4:5" sizes="(min-width: 768px) 36vw, 100vw" />
        </div>
      </div>
      <p className="px-5 py-24 font-serif text-4xl leading-tight md:px-14 md:py-36 md:text-6xl">
        Une maison.
        <span className="block">Pas un catalogue.</span>
      </p>
    </article>
  )
}
