import type { Metadata } from "next"
import { AdminConsole } from "@/components/admin-console"

export const metadata: Metadata = { title: "Atelier", robots: { index: false, follow: false } }

export default function AdminPage() {
  return (
    <main id="contenu" className="min-h-screen bg-paper">
      <AdminConsole />
    </main>
  )
}
