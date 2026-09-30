import type { MetadataRoute } from "next"
import { collections } from "@/lib/catalog"
import { getAllProducts } from "@/lib/inventory"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ["", "/shop", "/collections", "/lookbook", "/about", "/contact", "/cart", "/checkout", "/conditions", "/confidentialite"]
  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified: now,
  }))
  for (const collection of collections) {
    pages.push({ url: `${site.url}/collections/${collection.slug}`, lastModified: now })
  }
  for (const product of getAllProducts()) {
    pages.push({ url: `${site.url}/shop/${product.slug}`, lastModified: now })
  }
  return pages
}
