import { ConfirmButton } from "@/components/admin/confirm"
import { isAdmin } from "@/lib/admin"
import { PageTitle } from "@/components/admin/bits"
import { MediaTools } from "@/components/admin/panels"
import { mediaRepository } from "@/lib/repositories/media"

export const dynamic = "force-dynamic"

export default async function MediaPage() {
  if (!(await isAdmin())) return null
  const assets = mediaRepository.list()
  return (
    <div>
      <PageTitle title="Médias" text="Bibliothèque des images et vidéos. Seuls les fichiers déposés ici peuvent être supprimés.">
        <MediaTools />
      </PageTitle>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {assets.map((asset) => (
          <article key={asset.path} className="border border-line bg-white p-3 text-xs">
            {asset.type === "image" ? <img src={asset.path} alt="" className="mb-3 aspect-[3/4] w-full object-cover" /> : <div className="mb-3 grid aspect-[3/4] place-items-center bg-paper">Vidéo</div>}
            <p className="truncate">{asset.name}</p>
            <p className="mt-1 text-stone">{asset.type} · {Math.ceil(asset.size / 1024)} Ko · {asset.uses} usage{asset.uses > 1 ? "s" : ""}</p>
            {asset.path.startsWith("/media/uploads/") ? (
              <div className="mt-2">
                <ConfirmButton label="Supprimer" tone="danger" message={`Supprimer ${asset.name} ?`} request={{ url: `/api/admin/media?path=${encodeURIComponent(asset.path)}`, method: "DELETE" }} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
