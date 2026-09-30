import { cn } from "@/lib/utils"

export function Kicker({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] uppercase tracking-[0.22em] text-stone", className)}>
      {index ? <span className={className ? undefined : "text-wine"}>{index}</span> : null}
      {index ? <span className="mx-3 text-metal">/</span> : null}
      {children}
    </p>
  )
}

export function PageHeader({
  kicker,
  title,
  text,
}: {
  kicker: string
  title: string
  text?: string
}) {
  return (
    <header className="px-5 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36">
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">{title}</h1>
      {text ? <p className="mt-6 max-w-xl text-base leading-relaxed text-stone md:text-lg">{text}</p> : null}
    </header>
  )
}
