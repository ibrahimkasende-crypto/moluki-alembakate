import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { mediaRepository } from "@/lib/repositories/media"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  return NextResponse.json(mediaRepository.list())
}

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 })
  if (file.size > 8_000_000) return NextResponse.json({ error: "Fichier trop lourd." }, { status: 400 })
  const path = mediaRepository.saveUpload(file.name, Buffer.from(await file.arrayBuffer()))
  if (!path) return NextResponse.json({ error: "Format refusé." }, { status: 400 })
  return NextResponse.json({ path })
}

export async function DELETE(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const path = new URL(request.url).searchParams.get("path") || ""
  if (!mediaRepository.remove(path)) return NextResponse.json({ error: "Suppression refusée." }, { status: 400 })
  return NextResponse.json({ ok: true })
}
