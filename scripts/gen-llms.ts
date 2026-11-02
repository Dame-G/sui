// Writes plain-text docs for AI assistants: site/public/llms.txt (index), llms-full.txt (everything) and llms/<name>.txt (one per component).
// Each page is title, what it is, install command, API (read from the source) and a usage example (the docs demo).
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { components, groups } from '../registry/components'
import { extractApi } from '../site/props-lib'

const root = join(import.meta.dir, '..')
const pub = join(root, 'site', 'public')
const out = join(pub, 'llms')
const base = (process.env.SUI_REGISTRY_URL ?? 'http://localhost:5173/r').replace(/\/$/, '')
const site = base.replace(/\/r$/, '')

const cell = (v: string) => v.replace(/\|/g, '\\|').replace(/\n/g, ' ')

async function page(c: (typeof components)[number]) {
  const source = await readFile(join(root, 'registry', 'ui', `${c.name}.vue`), 'utf8')
  const demo = await readFile(join(root, 'site', 'src', 'demos', `${c.name}.vue`), 'utf8').catch(() => '')
  const api = extractApi(source)
  const lines: string[] = [`# ${c.title}`, '', c.description, '', `Group: ${c.group}. Registry item: ${base}/${c.name}.json`, '', '## Install', '', '```sh', `bunx shadcn-vue@latest add ${base}/${c.name}.json`, '```', '']
  const also = ['theme', 'utils', ...(c.uses ?? [])]
  const npm = [...(c.plain ? [] : ['reka-ui']), ...(c.deps ?? [])]
  lines.push(`Installs with: ${also.join(', ')}. npm packages: ${npm.length ? npm.join(', ') : 'none beyond Vue'}.`, '')
  lines.push('Import it from your own copy: `import ' + c.title.replace(/[^A-Za-z]/g, '') + " from '@/components/ui/" + c.name + ".vue'`.", '')

  const rows = [
    ...api.models.map((m) => [m.name === 'modelValue' ? 'v-model' : `v-model:${m.name}`, m.type, m.default ?? '', 'Two-way bound value.']),
    ...api.props.filter((p) => p.name !== 'class').map((p) => [p.required ? `${p.name} (required)` : p.name, p.type, p.default ?? '', p.description ?? '']),
  ]
  lines.push('## Props', '')
  if (rows.length) {
    lines.push('| Prop | Type | Default | What it does |', '| --- | --- | --- | --- |', ...rows.map((r) => `| ${r.map((x, i) => (i < 3 && x ? '`' + cell(x) + '`' : cell(x))).join(' | ')} |`))
  } else lines.push('No props; it takes content only.')
  if (api.extends.length) lines.push('', `Also takes everything in ${api.extends.join(', ')}, and \`class\` for placement only.`)
  if (api.events.length) lines.push('', `Events: ${api.events.map((e) => `\`${e.name}\``).join(', ')}.`)
  if (api.slots.length) lines.push('', `Slots: ${api.slots.map((s) => `\`${s}\``).join(', ')}.`)
  if (demo) lines.push('', '## Usage', '', '```vue', demo.trim(), '```')
  lines.push('', '## Rules', '', '- Style it through theme tokens, not classes: sui has one design per component and no variants. `tone` exists only on status components.', '- You own the copy: edit the file if the design must change.', '')
  return lines.join('\n')
}

await mkdir(out, { recursive: true })
const pages = new Map<string, string>()
for (const c of components) pages.set(c.name, await page(c))
for (const [name, text] of pages) await writeFile(join(out, `${name}.txt`), text)
const keep = new Set([...pages.keys()].map((n) => `${n}.txt`))
for (const f of await readdir(out)) if (!keep.has(f)) await rm(join(out, f))

const intro = `# sui

> A Vue 3 component registry in the shadcn style: you download the source with \`bunx shadcn-vue@latest add ${base}/<name>.json\` and own it. One distinct identity, themed only through tokens. Built on Reka UI, Tailwind v4 and TypeScript.

Identity (not options): a raised face sits on a darker 2px "slab"; 1px edges; soft tinted tones; stripes mean "still to do"; a dashed edge means disabled or busy; one control height; three font weights; mono for labels and figures. Components take no style variants. Theme the whole system with four tokens in sui-theme.css (brand colour, radius, slab depth, font); scheme (\`data-scheme="dark|auto"\`) and contrast (\`data-contrast="high|auto"\`) are attributes on <html>.

Setup: install Tailwind v4, add the \`@\` alias, add a components.json, then \`@import "./styles/sui-theme.css"\` after Tailwind. Steps: ${site}/#/start`

const index = [
  intro,
  '',
  ...groups.flatMap((g) => [`## ${g}`, '', ...components.filter((c) => c.group === g).map((c) => `- [${c.title}](${site}/llms/${c.name}.txt): ${c.description}`), '']),
  '## Optional',
  '',
  `- [Everything in one file](${site}/llms-full.txt)`,
  `- [Theme playground](${site}/#/theme)`,
  '',
].join('\n')
await writeFile(join(pub, 'llms.txt'), index)
await writeFile(join(pub, 'llms-full.txt'), [intro, '', ...[...pages.values()].map((p) => `\n---\n\n${p}`)].join('\n'))
console.log(`llms: ${pages.size} components -> site/public/llms*.txt (base ${base})`)
