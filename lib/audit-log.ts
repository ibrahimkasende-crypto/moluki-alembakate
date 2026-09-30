import { createId, readJson, writeJson } from "@/lib/store"

export type AuditEntry = {
  id: string
  at: string
  actor: string
  action: string
  target: string
  before?: string
  after?: string
}

export function listAudit() {
  return readJson<AuditEntry[]>("audit.json", []).sort((a, b) => (a.at < b.at ? 1 : -1))
}

export function recordAudit(entry: Omit<AuditEntry, "id" | "at" | "actor"> & { actor?: string }) {
  const all = listAudit()
  all.unshift({
    id: createId("AU"),
    at: new Date().toISOString(),
    actor: entry.actor || "Administrateur",
    action: entry.action,
    target: entry.target,
    before: entry.before,
    after: entry.after,
  })
  writeJson("audit.json", all.slice(0, 400))
}
