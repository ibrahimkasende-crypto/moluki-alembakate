import { DetailImage } from "@/components/detail-image"

export function Details() {
  return (
    <section className="px-5 py-28 md:px-12 md:py-40">
      <p className="text-[11px] uppercase tracking-[0.28em] text-stone">The details</p>
      <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] md:text-7xl">Tout se joue dans les détails.</h2>
      <div className="mt-16 md:mt-24">
        <DetailImage id="detail-griffe" ratio="4:5" className="md:w-[62%]" sizes="(min-width: 768px) 62vw, 100vw" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-[-8%] md:ml-[38%] md:w-[58%] md:grid-cols-2">
          <DetailImage id="detail-col" ratio="1:1" />
          <DetailImage id="detail-couture" ratio="1:1" className="md:mt-16" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-12">
          <DetailImage id="detail-bouton" ratio="1:1" className="md:col-span-3" />
          <DetailImage id="detail-tissu" ratio="4:5" className="md:col-span-4 md:col-start-5 md:mt-12" />
          <DetailImage id="detail-finition" ratio="2:3" className="md:col-span-3 md:col-start-10" />
        </div>
        <DetailImage id="detail-etiquette" ratio="1:1" className="mt-10 md:ml-[18%] md:mt-16 md:w-[28%]" />
      </div>
    </section>
  )
}
