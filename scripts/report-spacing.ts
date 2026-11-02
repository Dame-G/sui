// Lists raw px/rem values written into padding, margin and gap utilities across registry/ui, so they can become tokens or scale steps.
// Usage: bun run report:spacing [--all]   (by default `calc(... var(--token) ...)` compensations are summarised, not listed)
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const dir = join(import.meta.dir, '..', 'registry', 'ui')
const all = process.argv.includes('--all')
// p, px, py, pt..., m, mx..., gap, gap-x, gap-y, space-x, space-y, with an arbitrary value in brackets
const utility = /(?<![\w-])-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy])-\[([^\]\s]+)\]/g
const raw = /-?\d*\.?\d+(?:px|rem|em)\b/

const rows: { file: string; line: number; cls: string; value: string; kind: string }[] = []
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.vue')).sort()) {
  const lines = (await readFile(join(dir, f), 'utf8')).split('\n')
  lines.forEach((text, i) => {
    for (const m of text.matchAll(utility)) {
      if (!raw.test(m[1]!)) continue
      const compensated = m[1]!.includes('var(--')
      rows.push({ file: f, line: i + 1, cls: m[0], value: m[1]!, kind: compensated ? 'token-relative' : 'raw' })
    }
  })
}

const rawRows = rows.filter((r) => r.kind === 'raw')
const shown = all ? rows : rawRows
const w = (k: 'file' | 'cls') => Math.max(k === 'file' ? 4 : 5, ...shown.map((r) => (k === 'file' ? r.file.length + 5 : r.cls.length)))
console.log(`${'file:line'.padEnd(w('file'))}  ${'class'.padEnd(w('cls'))}  suggestion`)
for (const r of shown) {
  const rem = /^(-?[\d.]+)rem$/.exec(r.value)
  const step = rem ? `spacing scale step ${Number(rem[1]) * 4} (${r.value})` : /^(-?[\d.]+)px$/.exec(r.value) ? `a token or scale step (${r.value})` : 'a token'
  console.log(`${(r.file + ':' + r.line).padEnd(w('file'))}  ${r.cls.padEnd(w('cls'))}  ${r.kind === 'raw' ? step : 'compensates a token; fine'}`)
}
const files = new Set(rawRows.map((r) => r.file)).size
console.log(`\n${rawRows.length} raw px/rem spacing values in ${files} files; ${rows.length - rawRows.length} are calc() against a token${all ? '' : ' (hidden; --all to list)'}.`)
