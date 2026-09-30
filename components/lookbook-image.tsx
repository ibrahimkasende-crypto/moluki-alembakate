import Link from "next/link"
import { CampaignImage } from "@/components/campaign-image"

export function LookbookImage({
  id,
  index,
  total,
  kicker,
  title,
  text,
  href,
}: {
  id: string
  index: number
  total: number
  kicker: string
  title: string
  text: string
  href: string
}) {
  const current = String(index).padStart(2, "0")
  const count = String(total).padStart(2, "0")
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-ivory">
      <CampaignImage id={id} sizes="100vw" className="absolute inset-0" priority={index === 1} />
      <div className="scrim-bottom" />
      <div className="relative flex min-h-[100svh] flex-col justify-end px-5 py-12 md:px-14 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/75">{kicker}</p>
        <h2 className="mt-3 font-serif text-[clamp(2.4rem,12vw,7.5rem)] uppercase leading-[0.85] tracking-[0.03em]">{title}</h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/80">{text}</p>
        <div className="mt-8 flex items-center justify-between gap-6 text-[11px] uppercase tracking-[0.2em]">
          <Link href={href} className="nav-link">
            La pièce
          </Link>
          <span>
            {current} / {count}
          </span>
        </div>
      </div>
    </section>
  )
}
