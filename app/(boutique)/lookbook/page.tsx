import type { Metadata } from "next"
import { LookbookImage } from "@/components/lookbook-image"
import { looks } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Looks Moluki Alembakate : Moluki, Alembakate, Signature.",
}

const ids = ["look-moluki", "look-alembakate", "look-signature"]

export default function LookbookPage() {
  return (
    <div className="bg-ink">
      {looks.map((look, index) => (
        <LookbookImage
          key={look.id}
          id={ids[index] ?? "look-moluki"}
          index={index + 1}
          total={looks.length}
          kicker={index === 0 ? "Lookbook" : `Look ${String(index + 1).padStart(2, "0")}`}
          title={look.title}
          text={look.text}
          href={look.href}
        />
      ))}
    </div>
  )
}
