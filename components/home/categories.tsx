import Link from "next/link"
import { Media } from "@/components/media"
import { categories } from "@/lib/catalog"

export function Categories() {
  return (
    <section id="collection" className="px-3 py-20 md:px-6 md:py-28">
      <div className="px-2 pb-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">La collection</p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl">Les lignes</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-ivory sm:aspect-[4/5]"
          >
            <Media
              src={category.image}
              alt=""
              position={category.position}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute inset-x-0 bottom-0 h-2/5 bg-ink/45 transition-colors duration-700 group-hover:bg-ink/60" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-ivory md:p-8">
              <span className="font-serif text-4xl leading-none md:text-6xl">{category.name}</span>
              <span className="pb-1 text-[11px] uppercase tracking-[0.18em] opacity-100 md:opacity-0 md:transition md:duration-500 md:group-hover:opacity-100">
                Découvrir
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
