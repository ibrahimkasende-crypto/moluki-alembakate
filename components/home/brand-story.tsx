import { CampaignImage } from "@/components/campaign-image"
import { EditorialImage } from "@/components/editorial-image"

export function BrandStory() {
  return (
    <section className="overflow-x-clip">
      <CampaignImage id="hero-campagne" sizes="100vw" className="h-[78vh] min-h-[520px] md:h-[90vh]" />
      <div className="grid gap-10 px-5 py-24 md:grid-cols-12 md:px-14 md:py-36">
        <p className="font-serif text-4xl leading-[1.05] md:col-span-6 md:text-6xl">Le nom se pose. Le reste s&apos;efface.</p>
        <p className="max-w-md self-end text-base leading-relaxed text-stone md:col-span-4 md:col-start-8">
          Deux lignes, bordeaux sur ivoire. Moluki Alembakate ne raconte pas une légende. La maison coupe, et le vêtement parle.
        </p>
      </div>
      <div className="px-3 md:px-8">
        <div className="md:ml-auto md:w-[42%]">
          <EditorialImage id="campaign-bordeaux" ratio="3:4" reveal sizes="(min-width: 768px) 42vw, 100vw" />
        </div>
      </div>
      <p className="px-5 py-20 font-serif text-3xl leading-tight md:px-14 md:py-32 md:text-5xl">
        Une maison.
        <span className="block">Pas un catalogue.</span>
      </p>
    </section>
  )
}
