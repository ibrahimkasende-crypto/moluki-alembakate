import { readJson, writeJson } from "@/lib/store"

export type HomeContent = {
  heroKicker: string
  heroTitle: string
  heroCta: string
  heroHref: string
  featuredNote: string
}

const defaults = (): HomeContent => ({
  heroKicker: "",
  heroTitle: "",
  heroCta: "",
  heroHref: "/shop",
  featuredNote: "",
})

export const contentRepository = {
  get(): HomeContent {
    return { ...defaults(), ...readJson<Partial<HomeContent>>("content.json", {}) }
  },
  save(patch: Partial<HomeContent>) {
    const next = { ...this.get(), ...patch }
    writeJson("content.json", next)
    return next
  },
}
