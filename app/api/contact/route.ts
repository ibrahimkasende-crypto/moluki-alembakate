import { NextResponse } from "next/server"
import { readJson, writeJson } from "@/lib/store"

type Message = { id: string; name: string; email: string; message: string; createdAt: string }

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Message>
  if (!body.name || !body.email || !body.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Message incomplet." }, { status: 400 })
  }
  const messages = readJson<Message[]>("messages.json", [])
  messages.unshift({
    id: crypto.randomUUID(),
    name: body.name.slice(0, 120),
    email: body.email.slice(0, 180),
    message: body.message.slice(0, 2000),
    createdAt: new Date().toISOString(),
  })
  writeJson("messages.json", messages)
  return NextResponse.json({ ok: true })
}
