export const permissions = [
  "products.read",
  "products.write",
  "orders.read",
  "orders.write",
  "inventory.read",
  "inventory.write",
  "customers.read",
  "analytics.read",
  "settings.write",
] as const

export type Permission = (typeof permissions)[number]
export type Role = "owner" | "admin" | "manager" | "editor"

const matrix: Record<Role, readonly Permission[] | "all"> = {
  owner: "all",
  admin: "all",
  manager: ["products.read", "products.write", "orders.read", "orders.write", "inventory.read", "inventory.write", "customers.read", "analytics.read"],
  editor: ["products.read", "products.write", "orders.read", "inventory.read", "customers.read"],
}

export function currentRole(): Role {
  return "owner"
}

export function can(permission: Permission, role: Role = currentRole()) {
  const allowed = matrix[role]
  return allowed === "all" || allowed.includes(permission)
}
