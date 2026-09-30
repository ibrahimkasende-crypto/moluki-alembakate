import { randomBytes, timingSafeEqual } from "crypto"
import { mkdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const dataDir = join(process.cwd(), "data")

function filePath(name: string) {
  return join(dataDir, name)
}

export function readJson<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(filePath(name), "utf8")) as T
  } catch {
    return fallback
  }
}

export function writeJson(name: string, value: unknown) {
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(filePath(name), JSON.stringify(value, null, 2), "utf8")
}

export function createId(prefix: string) {
  return `${prefix}-${randomBytes(4).toString("hex").toUpperCase()}`
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) {
    timingSafeEqual(left, left)
    return false
  }
  return timingSafeEqual(left, right)
}
