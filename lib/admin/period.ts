export type RangeKey = "today" | "7d" | "30d" | "3m" | "12m" | "custom"

export type ResolvedRange = {
  key: RangeKey
  label: string
  start: Date
  end: Date
  previousStart: Date | null
  previousEnd: Date | null
}

const labels: Record<RangeKey, string> = {
  today: "Aujourd'hui",
  "7d": "7 jours",
  "30d": "30 jours",
  "3m": "3 mois",
  "12m": "12 mois",
  custom: "Personnalisé",
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

export function resolveRange(input: { range?: string; from?: string; to?: string }, now = new Date()): ResolvedRange {
  const key = (["today", "7d", "30d", "3m", "12m", "custom"] as const).includes(input.range as RangeKey)
    ? (input.range as RangeKey)
    : "30d"
  const end = new Date(now)
  let start = addDays(startOfDay(now), -29)
  if (key === "today") start = startOfDay(now)
  if (key === "7d") start = addDays(startOfDay(now), -6)
  if (key === "3m") start = addMonths(startOfDay(now), -3)
  if (key === "12m") start = addMonths(startOfDay(now), -12)
  if (key === "custom" && input.from && input.to) {
    const from = new Date(input.from)
    const to = new Date(input.to)
    if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from <= to) {
      start = startOfDay(from)
      end.setTime(to.getTime())
      end.setHours(23, 59, 59, 999)
    }
  }
  const span = end.getTime() - start.getTime()
  const previousEnd = new Date(start.getTime() - 1)
  const previousStart = new Date(previousEnd.getTime() - span)
  const comparable = key !== "custom" || Boolean(input.from && input.to)
  return {
    key,
    label: labels[key],
    start,
    end,
    previousStart: comparable ? previousStart : null,
    previousEnd: comparable ? previousEnd : null,
  }
}

export function inRange(iso: string, start: Date, end: Date) {
  const time = new Date(iso).getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export function percentChange(current: number, previous: number) {
  if (previous <= 0 || current < 0) return null
  return ((current - previous) / previous) * 100
}
