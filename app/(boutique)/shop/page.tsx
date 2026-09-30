import type { Metadata } from "next"
import { CampaignImage } from "@/components/campaign-image"
import { PageHeader } from "@/components/page-header"
import { ShopBrowser } from "@/components/shop-browser"
import { getAllProducts } from "@/lib/inventory"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Boutique",
  description: "Chemises, polos, complets, pantalons, tee-shirts et accessoires Moluki Alembakate.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : "tous"
  const q = typeof params.q === "string" ? params.q : ""
  const sort = typeof params.sort === "string" ? params.sort : "featured"
  return (
    <>
      <PageHeader kicker="Boutique" title="Les pièces" text="Une garde-robe courte. Chaque pièce se choisit pour sa coupe." />
      <div className="px-3 pb-16 md:px-8">
        <CampaignImage id="campaign-ligne" sizes="100vw" className="h-[58vh] min-h-[380px] md:h-[72vh]" />
      </div>
      <ShopBrowser products={getAllProducts()} initial={{ category, q, sort }} />
    </>
  )
}
