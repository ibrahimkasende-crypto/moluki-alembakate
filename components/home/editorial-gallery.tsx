import { EditorialImage } from "@/components/editorial-image"
import { ParallaxImage } from "@/components/parallax-image"

export function EditorialGallery() {
  return (
    <section className="overflow-x-clip pb-8" aria-label="Galerie">
      <ParallaxImage id="campaign-ligne" className="h-[78vh] md:h-[92vh]" amount={5} />

      <div className="px-5 py-28 md:py-44 md:pr-[18%] md:text-right">
        <p className="ml-auto max-w-3xl font-serif text-4xl leading-[1.02] md:text-6xl">La coupe tient dans le silence.</p>
      </div>

      <div className="px-3 md:px-8">
        <div className="md:w-[44%]">
          <EditorialImage id="brand-silhouette" ratio="2:3" reveal sizes="(min-width: 768px) 44vw, 100vw" />
        </div>
        <div className="mt-8 md:-mt-[22%] md:ml-auto md:w-[58%]">
          <EditorialImage id="campaign-chemise" ratio="16:9" reveal sizes="(min-width: 768px) 58vw, 100vw" />
        </div>
      </div>

      <div className="px-5 py-28 md:w-1/2 md:py-40 md:pl-16">
        <p className="font-serif text-3xl leading-tight md:text-5xl">Peu de couleurs. Une ligne.</p>
      </div>

      <div className="px-3 md:px-8">
        <div className="md:ml-[6%] md:w-[34%]">
          <EditorialImage id="campaign-jersey" ratio="1:1" sizes="(min-width: 768px) 34vw, 100vw" />
          <p className="mt-5 font-serif text-4xl md:text-5xl">Ivoire.</p>
        </div>
        <div className="mt-10 md:-mt-16 md:ml-[46%] md:w-[32%]">
          <EditorialImage id="campaign-bordeaux" ratio="2:3" reveal sizes="(min-width: 768px) 32vw, 100vw" />
        </div>
      </div>

      <div className="mt-16 md:mt-28">
        <ParallaxImage id="campaign-marche" className="h-[68vh] md:h-[84vh]" amount={6} reveal={false} />
      </div>
    </section>
  )
}
