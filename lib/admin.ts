import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const COOKIE = "ma_admin"

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createHmac("sha256", password).update("moluki-alembakate-admin").digest("hex")
}

export async function isAdmin() {
  const token = adminToken()
  if (!token) return false
  const jar = await cookies()
  const value = jar.get(COOKIE)?.value
  if (!value || value.length !== token.length) return false
  return timingSafeEqual(Buffer.from(value), Buffer.from(token))
}

export const adminCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12,
  },
}
