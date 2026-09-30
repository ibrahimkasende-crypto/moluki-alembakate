import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { recordAudit } from "@/lib/audit-log"
import { taxonomyRepository, type TaxonomyItem } from "@/lib/repositories/taxonomy"

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("products.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { kind?: "categories" | "collections"; items?: TaxonomyItem[] }
  if ((body.kind !== "categories" && body.kind !== "collections") || !body.items?.length) {
    return NextResponse.json({ error: "Liste invalide." }, { status: 400 })
  }
  const saved = taxonomyRepository.save(body.kind, body.items)
  recordAudit({ action: body.kind === "categories" ? "Catégories mises à jour" : "Collections mises à jour", target: String(saved.length) })
  return NextResponse.json(saved)
}
