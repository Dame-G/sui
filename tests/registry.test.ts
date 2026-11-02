// The registry is what users install. A wrong dependency or a missing file fails silently on their machine, so check the built output.
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { components } from '../registry/components'

const root = join(import.meta.dir, '..')
const BASE = 'https://sui.example/r'
let out = ''
const item = async (name: string) => JSON.parse(await readFile(join(out, `${name}.json`), 'utf8'))

beforeAll(async () => {
  out = await mkdtemp(join(tmpdir(), 'sui-registry-'))
  const p = Bun.spawnSync(['bun', 'scripts/build-registry.ts'], { cwd: root, env: { ...process.env, SUI_REGISTRY_URL: BASE, SUI_REGISTRY_OUT: out } })
  if (p.exitCode !== 0) throw new Error(p.stderr.toString())
})
afterAll(() => rm(out, { recursive: true, force: true }))

describe('manifest', () => {
  test('names are unique and every one has a source file, a demo and a props-friendly title', () => {
    const names = components.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
    for (const c of components) {
      expect(existsSync(join(root, 'registry/ui', `${c.name}.vue`))).toBe(true)
      expect(existsSync(join(root, 'site/src/demos', `${c.name}.vue`))).toBe(true)
      expect(c.title.length).toBeGreaterThan(0)
    }
  })
  test('every ui file is in the manifest', async () => {
    const files = (await readdir(join(root, 'registry/ui'))).map((f) => f.replace('.vue', '')).sort()
    expect(files).toEqual(components.map((c) => c.name).sort())
  })
})

describe('built registry', () => {
  test('one item per component plus theme, utils, announce, and an index', async () => {
    const files = (await readdir(out)).sort()
    expect(files).toEqual([...components.map((c) => c.name), 'announce', 'theme', 'utils'].map((n) => `${n}.json`).concat('registry.json').sort())
  })

  test('registryDependencies point at real items, under the base URL', async () => {
    for (const c of components) {
      const it = await item(c.name)
      expect(it.registryDependencies).toContain(`${BASE}/theme.json`)
      for (const dep of it.registryDependencies as string[]) {
        expect(dep.startsWith(`${BASE}/`)).toBe(true)
        expect(existsSync(join(out, dep.slice(BASE.length + 1)))).toBe(true)
      }
    }
  })

  test("what a file imports is what the item declares", async () => {
    for (const c of components) {
      const it = await item(c.name)
      const src: string = it.files[0].content
      const npm = [...src.matchAll(/from '((?:@[\w-]+\/)?[\w.-]+)[^']*'/g)].map((m) => m[1]!).filter((m) => !['vue', 'clsx'].includes(m) && !m.startsWith('@/') && !m.startsWith('.'))
      for (const pkg of new Set(npm)) expect(it.dependencies ?? [], `${c.name} imports ${pkg}`).toContain(pkg)
      if (c.plain) expect(src, `${c.name} is plain`).not.toContain("from 'reka-ui'")
      else expect(src, `${c.name} needs reka-ui`).toContain("from 'reka-ui'")
      const used = [...src.matchAll(/@\/components\/ui\/([\w-]+)\.vue/g)].map((m) => m[1]!)
      for (const u of new Set(used)) {
        if (u === c.name) continue
        expect(it.registryDependencies, `${c.name} imports ${u}`).toContain(`${BASE}/${u}.json`)
      }
      if (src.includes('@/lib/announce')) expect(it.registryDependencies).toContain(`${BASE}/announce.json`)
    }
  })

  test('no file is empty and no dev URL or old name leaks', async () => {
    for (const f of await readdir(out)) {
      const text = await readFile(join(out, f), 'utf8')
      expect(text).not.toContain('localhost')
      expect(text.toLowerCase()).not.toMatch(/\beos\b/)
      if (f !== 'registry.json') for (const file of JSON.parse(text).files) expect(file.content.length).toBeGreaterThan(50)
    }
  })

  test('the theme installs where the docs say it does', async () => {
    const t = await item('theme')
    expect(t.files[0].target).toBe('src/styles/sui-theme.css')
  })
})
