import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { recordAudit } from "@/lib/audit-log"
import { settingsRepository, type ShopSettings } from "@/lib/repositories/settings"

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("settings.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as Partial<ShopSettings>
  const saved = settingsRepository.save(body)
  recordAudit({ action: "Paramètres enregistrés", target: "Boutique" })
  return NextResponse.json(saved)
}
