import { getMedia, type MediaAsset } from "@/lib/media"

export type VisualOrigin = "maison" | "attente"

export type Visual = {
  slot: string
  alt: string
  src?: string
  position?: string
  origin: VisualOrigin
  placeholder?: boolean
}

export function toVisual(asset: MediaAsset): Visual {
  return {
    slot: asset.id,
    alt: asset.alt,
    src: asset.src,
    position: asset.position,
    origin: asset.origin === "maison" ? "maison" : "attente",
    placeholder: asset.placeholder || !asset.src,
  }
}

function visual(id: string): Visual {
  return toVisual(getMedia(id))
}

export const visuals = {
  hero: visual("hero-campagne"),
  introWordmark: visual("brand-wordmark"),
  silhouette: visual("brand-silhouette"),
  campaignLigne: visual("campaign-ligne"),
  campaignChemise: visual("campaign-chemise"),
  campaignMarche: visual("campaign-marche"),
  campaignSable: visual("campaign-sable"),
  campaignJersey: visual("campaign-jersey"),
  campaignBordeaux: visual("campaign-bordeaux"),
  detailGriffe: visual("detail-griffe"),
  detailCouture: visual("detail-couture"),
  detailCol: visual("detail-col"),
  detailBouton: visual("detail-bouton"),
  detailTissu: visual("detail-tissu"),
  detailFinition: visual("detail-finition"),
  detailEtiquette: visual("detail-etiquette"),
}

export const socialFrames: Visual[] = ["social-01", "social-02", "social-03", "social-04", "social-05", "social-06", "social-07", "social-08", "social-09"].map(visual)
