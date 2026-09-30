import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { contentRepository, type HomeContent } from "@/lib/repositories/content"

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("settings.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as Partial<HomeContent>
  return NextResponse.json(contentRepository.save(body))
}
