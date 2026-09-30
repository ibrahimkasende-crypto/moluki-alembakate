import { MediaGrid } from "@/components/media-grid"
import { site } from "@/lib/site"

const items = [
  { id: "social-01", ratio: "2:3" as const, className: "col-span-2 md:col-span-5" },
  { id: "social-02", ratio: "3:4" as const, className: "md:col-span-3" },
  { id: "social-03", ratio: "4:5" as const, className: "md:col-span-3" },
  { id: "social-04", ratio: "1:1" as const, className: "md:col-span-4 md:mt-10" },
  { id: "social-05", ratio: "1:1" as const, className: "md:col-span-3 md:-mt-8" },
  { id: "social-07", ratio: "2:3" as const, className: "md:col-span-3" },
  { id: "social-06", ratio: "16:9" as const, className: "col-span-2 md:col-span-7" },
  { id: "social-08", ratio: "4:5" as const, className: "md:col-span-3" },
  { id: "social-09", ratio: "3:4" as const, className: "md:col-span-2" },
]

export function SocialGrid() {
  const label = site.instagram ? (
    <a href={site.instagram} target="_blank" rel="noreferrer" className="nav-link text-[11px] uppercase tracking-[0.28em]">
      Follow Moluki
    </a>
  ) : (
    <p className="text-[11px] uppercase tracking-[0.28em]">Follow Moluki</p>
  )

  return (
    <section className="px-3 py-24 md:px-8 md:py-36" aria-label="Galerie Moluki">
      <div className="mb-10 flex items-end justify-between px-2 md:px-2">{label}</div>
      <MediaGrid items={items} />
    </section>
  )
}
