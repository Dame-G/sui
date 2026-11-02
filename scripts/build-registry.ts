// Inlines file contents into per-item JSON in shadcn registry format -> site/public/r/
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { components } from '../registry/components'

const root = join(import.meta.dir, '..')
const src = join(root, 'registry')
const out = process.env.SUI_REGISTRY_OUT ?? join(root, 'site', 'public', 'r')
const base = (process.env.SUI_REGISTRY_URL ?? 'http://localhost:5173/r').replace(/\/$/, '')
const url = (name: string) => `${base}/${name}.json`

type File = { path: string; type: string; target?: string }
type Item = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: File[]
}

const items: Item[] = [
  {
    name: 'theme',
    type: 'registry:file',
    title: 'sui theme tokens',
    description: 'Tailwind v4 @theme tokens. Import once in your main CSS, after tailwindcss.',
    dependencies: ['tailwindcss'],
    files: [{ path: 'theme.css', type: 'registry:file', target: 'src/styles/sui-theme.css' }],
  },
  {
    name: 'utils',
    type: 'registry:lib',
    title: 'cn helper',
    dependencies: ['clsx', 'tailwind-merge'],
    files: [{ path: 'lib/utils.ts', type: 'registry:lib' }],
  },
  {
    name: 'announce',
    type: 'registry:lib',
    title: 'announce helper',
    description: 'A shared screen-reader live region: announce("3 selected").',
    files: [{ path: 'lib/announce.ts', type: 'registry:lib' }],
  },
  ...components.map((c): Item => ({
    name: c.name,
    type: 'registry:ui',
    title: c.title,
    description: c.description,
    dependencies: [...(c.plain ? [] : ['reka-ui']), ...(c.deps ?? [])],
    registryDependencies: [url('theme'), url('utils'), ...(c.uses ?? []).map(url)],
    files: [{ path: `ui/${c.name}.vue`, type: 'registry:ui' }],
  })),
]

// Write in place (a running dev server caches the folder's file list, so don't delete the folder); prune stale files after.
await mkdir(out, { recursive: true })

for (const item of items) {
  const files = await Promise.all(
    item.files.map(async (f) => ({
      ...f,
      // Flat names: the CLI places them under the consumer's own alias dirs.
      path: f.path.split('/').pop()!,
      content: await readFile(join(src, f.path), 'utf8'),
    })),
  )
  const built = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item, files }
  if (!built.dependencies?.length) delete built.dependencies
  if (!built.registryDependencies?.length) delete built.registryDependencies
  await writeFile(join(out, `${item.name}.json`), JSON.stringify(built, null, 2))
}

await writeFile(
  join(out, 'registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'sui',
      homepage: base.replace(/\/r$/, ''),
      items: items.map(({ files, ...i }) => ({ ...i, files: files.map(({ path, type, target }) => ({ path, type, ...(target ? { target } : {}) })) })),
    },
    null,
    2,
  ),
)
const keep = new Set([...items.map((i) => `${i.name}.json`), 'registry.json'])
for (const f of await readdir(out)) if (!keep.has(f)) await rm(join(out, f))
console.log(`registry: ${items.length} items -> site/public/r (base ${base})`)
