import { readJson, writeJson } from "@/lib/store"
import { createId } from "@/lib/store"

export type Promotion = {
  id: string
  code: string
  kind: "percent" | "fixed"
  value: number
  startsAt: string
  endsAt: string
  minAmount: number
  productIds: string[]
  categories: string[]
  maxUses: number | null
  status: "active" | "paused"
}

export type Campaign = {
  id: string
  title: string
  image: string
  description: string
  startsAt: string
  endsAt: string
  productIds: string[]
  cta: string
  status: "draft" | "active" | "ended"
}

type FileShape = { promotions: Promotion[]; campaigns: Campaign[] }

const empty = (): FileShape => ({ promotions: [], campaigns: [] })

function load() {
  return { ...empty(), ...readJson<FileShape>("promotions.json", empty()) }
}

export const promotionsRepository = {
  list: () => load().promotions,
  campaigns: () => load().campaigns,
  savePromotion(entry: Omit<Promotion, "id"> & { id?: string }) {
    const file = load()
    const next: Promotion = {
      ...entry,
      id: entry.id || createId("CP"),
      code: entry.code.trim().toUpperCase(),
      value: Math.max(0, entry.value),
      minAmount: Math.max(0, entry.minAmount),
      productIds: entry.productIds.filter(Boolean),
      categories: entry.categories.filter(Boolean),
    }
    const index = file.promotions.findIndex((item) => item.id === next.id)
    if (index >= 0) file.promotions[index] = next
    else file.promotions.unshift(next)
    writeJson("promotions.json", file)
    return next
  },
  saveCampaign(entry: Omit<Campaign, "id"> & { id?: string }) {
    const file = load()
    const next: Campaign = { ...entry, id: entry.id || createId("OF"), productIds: entry.productIds.filter(Boolean) }
    const index = file.campaigns.findIndex((item) => item.id === next.id)
    if (index >= 0) file.campaigns[index] = next
    else file.campaigns.unshift(next)
    writeJson("promotions.json", file)
    return next
  },
}
