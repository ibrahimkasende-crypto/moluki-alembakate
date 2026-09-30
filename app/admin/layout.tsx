import type { Metadata } from "next"
import { isAdmin } from "@/lib/admin"
import { AdminGate } from "@/components/admin/gate"
import { AdminShell } from "@/components/admin/shell"
import { notificationsRepository } from "@/lib/repositories/notifications"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) return <AdminGate />
  return <AdminShell notices={notificationsRepository.list()}>{children}</AdminShell>
}
