import Link from "next/link"
import { ArrowIcon } from "@/components/icons"
import { Media } from "@/components/media"
import { ImageReveal, TextReveal } from "@/components/motion"
import { homeStills } from "@/lib/media"

const blocks = [
  { href: "/shop?category=chemises", name: "Chemises", src: homeStills.col, variant: "up" as const },
  { href: "/shop?category=polos", name: "Polos", src: homeStills.portrait, variant: "left" as const },
  { href: "/shop?category=complets", name: "Complets", src: homeStills.lookB, variant: "right" as const },
  { href: "/shop?category=t-shirts", name: "T-shirts", src: homeStills.essentiel, variant: "center" as const },
  { href: "/shop?category=pantalons", name: "Pantalons", src: homeStills.pantalon, variant: "left" as const },
  { href: "/shop?category=accessoires", name: "Accessoires", src: homeStills.accessoire, variant: "up" as const },
]

export function Categories() {
  return (
    <section className="section-space bg-paper" aria-label="Catégories">
      <div className="shell">
        <TextReveal text="Pièces" className="font-serif text-5xl leading-[0.92] md:text-7xl" />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {blocks.map((block) => (
            <Link key={block.name} href={block.href} data-explore="Explorer" className="group relative block aspect-[3/4] overflow-hidden bg-ivory sm:aspect-[4/5]">
              <ImageReveal variant={block.variant}>
                <Media src={block.src} alt="" sizes="(min-width: 768px) 45vw, 100vw" className="img-zoom" />
              </ImageReveal>
              <span className="pointer-events-none absolute inset-0 bg-ink/20 transition-colors duration-700 group-hover:bg-ink/35" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-ivory transition-transform duration-700 ease-out group-hover:-translate-y-1 md:p-8">
                <span className="font-serif text-4xl leading-none md:text-6xl">{block.name}</span>
                <ArrowIcon className="mb-2 opacity-0 transition duration-500 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
