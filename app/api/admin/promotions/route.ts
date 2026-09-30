import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"
import { can } from "@/lib/admin/permissions"
import { recordAudit } from "@/lib/audit-log"
import { promotionsRepository } from "@/lib/repositories/promotions"
import type { Campaign, Promotion } from "@/lib/repositories/promotions"

export async function POST(request: Request) {
  if (!(await isAdmin()) || !can("settings.write")) return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  const body = (await request.json()) as { kind?: string; promotion?: Promotion; campaign?: Campaign }
  if (body.kind === "promotion" && body.promotion?.code) {
    const saved = promotionsRepository.savePromotion(body.promotion)
    recordAudit({ action: "Promotion enregistrée", target: saved.code })
    return NextResponse.json(saved)
  }
  if (body.kind === "campaign" && body.campaign?.title) {
    const saved = promotionsRepository.saveCampaign(body.campaign)
    recordAudit({ action: "Offre enregistrée", target: saved.title })
    return NextResponse.json(saved)
  }
  return NextResponse.json({ error: "Offre invalide." }, { status: 400 })
}
