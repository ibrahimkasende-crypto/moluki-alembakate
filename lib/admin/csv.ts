export function toCsv(rows: string[][]) {
  const lines = rows.map((row) => row.map(escape).join(","))
  return `\uFEFF${lines.join("\n")}`
}

function escape(value: string) {
  const text = value.replaceAll('"', '""')
  return /[",\n]/.test(text) ? `"${text}"` : text
}
