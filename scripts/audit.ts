// Browser audit of the built site: axe (WCAG A/AA) in light and dark, and horizontal overflow at 375px, on every page.
// Run `bun run build` first. Chromium: set SUI_CHROME to a binary, or `bunx playwright-core install chromium`.
import { chromium } from 'playwright-core'
import { join } from 'node:path'
import { components } from '../registry/components'

const dist = join(import.meta.dir, '..', 'site', 'dist')
const axeSource = await Bun.file(join(import.meta.dir, '..', 'node_modules', 'axe-core', 'axe.min.js')).text()
const server = Bun.serve({
  port: 4398,
  async fetch(req) {
    const path = new URL(req.url).pathname
    const f = Bun.file(join(dist, path === '/' ? 'index.html' : path))
    return (await f.exists()) ? new Response(f) : new Response('not found', { status: 404 })
  },
})
const pages = ['', 'start', 'theme', 'style', 'blocks', ...components.map((c) => `components/${c.name}`)]
const browser = await chromium.launch(process.env.SUI_CHROME ? { executablePath: process.env.SUI_CHROME } : {})
const problems: string[] = []

for (const [width, scheme] of [[1200, 'light'], [1200, 'dark'], [375, 'light']] as const) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const name of pages) {
    await page.goto(`http://localhost:4398/#/${name}`)
    await page.waitForTimeout(250)
    await page.evaluate((s) => (document.documentElement.dataset.scheme = s), scheme)
    if (width === 375) {
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      if (over > 0) problems.push(`overflow +${over}px at 375px: ${name || 'home'}`)
      continue
    }
    await page.evaluate(axeSource)
    // landmark-unique: the docs show a component next to the site's own copy of it; not a library fault.
    const violations = await page.evaluate(async () => {
      // @ts-expect-error axe is injected above
      const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'], rules: { 'landmark-unique': { enabled: false } } })
      return r.violations.map((v: { id: string; nodes: { target: string[] }[] }) => `${v.id} ${v.nodes[0]!.target.join(' ').slice(0, 80)}`)
    })
    for (const v of violations) problems.push(`${scheme} ${name || 'home'}: ${v}`)
  }
  await page.close()
}
await browser.close()
server.stop(true)
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`audit ok: ${pages.length} pages, light + dark axe clean, no overflow at 375px`)
