import { NextResponse } from "next/server"
import { adminConfigured, adminCookie, adminCredentialsMatch, adminToken } from "@/lib/admin"

export async function POST(request: Request) {
  const token = adminToken()
  if (!adminConfigured() || !token) {
    return NextResponse.json({ error: "Accès administrateur non configuré." }, { status: 503 })
  }
  const body = (await request.json()) as { email?: string; password?: string }
  if (!body.email || !body.password || !adminCredentialsMatch(body.email, body.password)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminCookie.name, token, adminCookie.options)
  return response
}
