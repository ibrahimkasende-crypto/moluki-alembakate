import { readdirSync, statSync, mkdirSync, writeFileSync, unlinkSync } from "fs"
import { join, extname, relative } from "path"
import { listCatalog } from "@/lib/inventory"

const root = join(process.cwd(), "public", "media")
const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".mp4", ".webm"])

export type MediaAsset = {
  path: string
  name: string
  type: "image" | "video"
  size: number
  modifiedAt: string
  uses: number
}

function walk(dir: string, into: MediaAsset[]) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, into)
      continue
    }
    const ext = extname(entry.name).toLowerCase()
    if (!allowed.has(ext)) continue
    const stat = statSync(full)
    const path = `/${relative(join(process.cwd(), "public"), full).replaceAll("\\", "/")}`
    into.push({
      path,
      name: entry.name,
      type: ext === ".mp4" || ext === ".webm" ? "video" : "image",
      size: stat.size,
      modifiedAt: stat.mtime.toISOString(),
      uses: 0,
    })
  }
}

export const mediaRepository = {
  list(): MediaAsset[] {
    const assets: MediaAsset[] = []
    try {
      walk(root, assets)
    } catch {
      return []
    }
    const used = new Map<string, number>()
    for (const product of listCatalog()) {
      for (const image of product.images) used.set(image.src, (used.get(image.src) ?? 0) + 1)
    }
    return assets
      .map((asset) => ({ ...asset, uses: used.get(asset.path) ?? 0 }))
      .sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1))
  },
  saveUpload(name: string, bytes: Buffer) {
    const ext = extname(name).toLowerCase()
    if (!allowed.has(ext)) return null
    const safe = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80)
    const dir = join(root, "uploads")
    mkdirSync(dir, { recursive: true })
    const file = `${Date.now()}-${safe}`
    writeFileSync(join(dir, file), bytes)
    return `/media/uploads/${file}`
  },
  remove(path: string) {
    if (!path.startsWith("/media/uploads/")) return false
    const full = join(process.cwd(), "public", path)
    if (!full.startsWith(join(root, "uploads"))) return false
    unlinkSync(full)
    return true
  },
}
