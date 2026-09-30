import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { safeEqual } from "@/lib/store"

const COOKIE = "ma_admin"
const ADMIN_EMAIL = "moluki@alembakate.com"
const ADMIN_PASSWORD = "Admin123456"

export function adminToken() {
  return createHmac("sha256", ADMIN_PASSWORD).update("moluki-alembakate-admin").digest("hex")
}

export function adminCredentialsMatch(email: string, password: string) {
  const sameEmail = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL)
  const samePassword = safeEqual(password, ADMIN_PASSWORD)
  return sameEmail && samePassword
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
