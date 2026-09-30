import type { Metadata } from "next"
import Link from "next/link"
import { Media } from "@/components/media"
import { PageHeader } from "@/components/page-header"
import { collections } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Collections",
  description: "Nouvelle saison, essentiels et signature Moluki Alembakate.",
}

export default function CollectionsPage() {
  return (
    <>
      <PageHeader kicker="Collections" title="Trois lignes" text="Pas un catalogue infini. Trois manières d'entrer dans la maison." />
      <div className="grid gap-6 px-5 pb-20 md:px-12">
        {collections.map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group grid overflow-hidden bg-ivory md:grid-cols-2">
            <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[78vh]">
              <Media src={collection.image} alt="" position={collection.position} sizes="(min-width: 768px) 50vw, 100vw" className="transition duration-[1400ms] group-hover:scale-[1.05]" />
            </div>
            <div className="flex flex-col justify-end p-8 md:p-12">
              <h2 className="font-serif text-5xl">{collection.name}</h2>
              <p className="mt-4 max-w-md text-stone">{collection.text}</p>
              <span className="mt-6 text-[11px] uppercase tracking-[0.18em]">Voir la ligne</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
