import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { safeEqual } from "@/lib/store"

const COOKIE = "ma_admin"

function adminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || ""
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || ""
}

export function adminConfigured() {
  return Boolean(adminEmail() && adminPassword())
}

export function adminToken() {
  const password = adminPassword()
  if (!password) return null
  return createHmac("sha256", password).update("moluki-alembakate-admin").digest("hex")
}

export function adminCredentialsMatch(email: string, password: string) {
  const expectedEmail = adminEmail()
  const expectedPassword = adminPassword()
  if (!expectedEmail || !expectedPassword) return false
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(password, expectedPassword)
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
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  },
}
