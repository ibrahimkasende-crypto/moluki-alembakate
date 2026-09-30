import { NextResponse } from "next/server"
import { readJson, writeJson } from "@/lib/store"

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string }
  const email = body.email?.trim().toLowerCase() ?? ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse invalide." }, { status: 400 })
  }
  const list = readJson<{ email: string; createdAt: string }[]>("newsletter.json", [])
  if (!list.some((entry) => entry.email === email)) {
    list.unshift({ email, createdAt: new Date().toISOString() })
    writeJson("newsletter.json", list)
  }
  return NextResponse.json({ ok: true })
}
