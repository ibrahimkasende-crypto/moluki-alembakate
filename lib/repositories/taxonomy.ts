import { categories, collections } from "@/lib/catalog"
import { readJson, writeJson } from "@/lib/store"

export type TaxonomyItem = {
  slug: string
  name: string
  description: string
  image: string
  order: number
  status: "active" | "archived"
  kind: "category" | "collection"
}

type FileShape = { categories: TaxonomyItem[]; collections: TaxonomyItem[] }

function seed(): FileShape {
  return {
    categories: categories.map((item, index) => ({
      slug: item.slug,
      name: item.name,
      description: item.text,
      image: item.image,
      order: index,
      status: "active" as const,
      kind: "category" as const,
    })),
    collections: collections.map((item, index) => ({
      slug: item.slug,
      name: item.name,
      description: item.text,
      image: item.image,
      order: index,
      status: "active" as const,
      kind: "collection" as const,
    })),
  }
}

function load(): FileShape {
  const file = readJson<Partial<FileShape>>("taxonomy.json", {})
  const base = seed()
  return {
    categories: file.categories?.length ? file.categories : base.categories,
    collections: file.collections?.length ? file.collections : base.collections,
  }
}

export const taxonomyRepository = {
  categories: () => [...load().categories].sort((a, b) => a.order - b.order),
  collections: () => [...load().collections].sort((a, b) => a.order - b.order),
  save(kind: "categories" | "collections", items: TaxonomyItem[]) {
    const file = load()
    file[kind] = items
    writeJson("taxonomy.json", file)
    return file[kind]
  },
}
