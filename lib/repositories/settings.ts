import { readJson, writeJson } from "@/lib/store"
import { site } from "@/lib/site"

export type ShopSettings = {
  lowStockThreshold: number
  contactEmail: string
  instagram: string
  seoTitle: string
  seoDescription: string
}

const defaults = (): ShopSettings => ({
  lowStockThreshold: 3,
  contactEmail: site.email,
  instagram: site.instagram,
  seoTitle: site.name,
  seoDescription: site.description,
})

export const settingsRepository = {
  get(): ShopSettings {
    return { ...defaults(), ...readJson<Partial<ShopSettings>>("settings.json", {}) }
  },
  save(patch: Partial<ShopSettings>) {
    const next = { ...this.get(), ...patch }
    next.lowStockThreshold = Math.max(0, Math.round(next.lowStockThreshold) || 0)
    writeJson("settings.json", next)
    return next
  },
}
