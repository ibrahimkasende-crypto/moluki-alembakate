import Link from "next/link"
import { ArrowIcon } from "@/components/icons"
import { Media } from "@/components/media"
import { ImageReveal, RevealOnScroll } from "@/components/motion"
import { homeStills } from "@/lib/media"

const lines = [
  {
    href: "/shop?category=chemises",
    name: "Chemises",
    src: homeStills.chemise,
    className: "md:col-span-7",
    ratio: "aspect-[4/5] md:aspect-[5/4]",
    variant: "left" as const,
  },
  {
    href: "/shop?category=polos",
    name: "Polos",
    plate: true,
    className: "md:col-span-5 md:mt-24",
    ratio: "aspect-[3/4]",
    variant: "up" as const,
  },
  {
    href: "/shop?category=complets",
    name: "Complets",
    src: homeStills.complet,
    className: "md:col-span-5",
    ratio: "aspect-[3/4]",
    variant: "right" as const,
  },
  {
    href: "/collections/essentiels",
    name: "Essentiels",
    src: homeStills.lookC,
    className: "md:col-span-7 md:mt-10",
    ratio: "aspect-[4/5] md:aspect-[16/11]",
    variant: "center" as const,
  },
]

export function FeaturedCollection() {
  return (
    <section className="section-space bg-ivory" aria-label="Collection">
      <div className="shell">
        <RevealOnScroll>
          <p className="font-serif text-5xl uppercase leading-[0.92] md:text-7xl">Collection</p>
        </RevealOnScroll>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {lines.map((line) => (
            <Link
              key={line.name}
              href={line.href}
              data-explore="Explorer"
              className={`group relative block overflow-hidden bg-ivory ${line.className} ${line.ratio}`}
            >
              <ImageReveal variant={line.variant}>
                {line.plate ? (
                  <span className="absolute inset-0 grid place-items-center p-10">
                    <img src="/media/categories/polos.svg" alt="" className="h-full w-full object-contain transition duration-[1400ms] ease-out group-hover:scale-[1.03]" />
                  </span>
                ) : (
                  <Media src={line.src!} alt="" sizes="(min-width: 768px) 55vw, 100vw" className="img-zoom" />
                )}
              </ImageReveal>
              {line.plate ? null : <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />}
              <span className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 transition-transform duration-700 ease-out group-hover:-translate-y-1 md:p-7 ${line.plate ? "text-ink" : "text-ivory"}`}>
                <span className="font-serif text-4xl leading-none md:text-5xl">{line.name}</span>
                <ArrowIcon className="mb-2 translate-x-0 opacity-0 transition duration-500 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
