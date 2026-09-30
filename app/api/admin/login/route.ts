import { NextResponse } from "next/server"
import { adminCookie, adminToken } from "@/lib/admin"
import { safeEqual } from "@/lib/store"

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD
  const token = adminToken()
  if (!expected || !token) {
    return NextResponse.json({ error: "ADMIN_PASSWORD manquant." }, { status: 503 })
  }
  const body = (await request.json()) as { password?: string }
  if (!body.password || !safeEqual(body.password, expected)) {
    return NextResponse.json({ error: "Mot de passe refusé." }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminCookie.name, token, adminCookie.options)
  return response
}
