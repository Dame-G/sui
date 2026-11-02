// Install smoke test: serve the built registry, install every item into a fresh Vue app with the shadcn-vue CLI, then typecheck and build it.
// Needs network (npm + the CLI). Run: bun run smoke
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { components } from '../registry/components'

const root = join(import.meta.dir, '..')
const port = 4399
const base = `http://localhost:${port}/r`
const reg = await mkdtemp(join(tmpdir(), 'sui-reg-'))
const app = await mkdtemp(join(tmpdir(), 'sui-app-'))

// Async on purpose: the registry server runs in this process, so a blocking spawn would starve the CLI's requests.
async function run(cmd: string[], cwd: string, env: Record<string, string> = {}) {
  const p = Bun.spawn(cmd, { cwd, env: { ...process.env, ...env }, stdout: 'pipe', stderr: 'pipe' })
  const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text(), p.exited])
  if (p.exitCode !== 0) throw new Error(`${cmd.join(' ')}\n${out}\n${err}`)
}
const write = (f: string, s: string) => mkdir(join(app, f, '..'), { recursive: true }).then(() => writeFile(join(app, f), s))

let server: ReturnType<typeof Bun.serve> | undefined
try {
  await run(['bun', 'scripts/build-registry.ts'], root, { SUI_REGISTRY_URL: base, SUI_REGISTRY_OUT: reg })
  server = Bun.serve({
    port,
    fetch: (req) => {
      const f = Bun.file(join(reg, new URL(req.url).pathname.replace(/^\/r\//, '')))
      return f.size ? new Response(f) : new Response('not found', { status: 404 })
    },
  })

  await write('package.json', JSON.stringify({ name: 'smoke', private: true, type: 'module' }))
  await write('index.html', '<div id="app"></div><script type="module" src="/src/main.ts"></script>')
  await write('vite.config.ts', "import { fileURLToPath } from 'node:url'\nimport vue from '@vitejs/plugin-vue'\nimport tailwindcss from '@tailwindcss/vite'\nexport default { plugins: [vue(), tailwindcss()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } } }\n")
  await write('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', strict: true, noUnusedLocals: true, skipLibCheck: true, types: ['vite/client'], paths: { '@/*': ['./src/*'] } }, include: ['src/**/*.ts', 'src/**/*.vue', 'vite.config.ts'] }))
  await write('components.json', JSON.stringify({ $schema: 'https://shadcn-vue.com/schema.json', style: 'new-york', typescript: true, tailwind: { config: '', css: 'src/style.css', baseColor: 'neutral', cssVariables: true }, aliases: { components: '@/components', composables: '@/composables', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib' } }))
  await write('src/style.css', "@import 'tailwindcss';\n")
  await write('src/main.ts', "import { createApp } from 'vue'\nimport App from './App.vue'\nimport './style.css'\ncreateApp(App).mount('#app')\n")
  await write('src/env.d.ts', "declare module '*.vue' { import type { DefineComponent } from 'vue'; const c: DefineComponent; export default c }\n")
  await write('src/App.vue', "<script setup lang=\"ts\">\n// Pull every installed component into the build.\nconst all = import.meta.glob('./components/ui/*.vue')\nconsole.log(Object.keys(all).length)\n</script>\n<template><div /></template>\n")

  await run(['bun', 'add', 'vue', 'tailwindcss', '@tailwindcss/vite', 'vite', '@vitejs/plugin-vue', 'vue-tsc', 'typescript@~5.9', '@types/node'], app)
  const urls = ['theme', 'utils', 'announce', ...components.map((c) => c.name)].map((n) => `${base}/${n}.json`)
  await run(['bunx', '--bun', 'shadcn-vue@latest', 'add', ...urls, '--yes', '--overwrite'], app)
  // The theme goes where the docs say; import it once, after tailwindcss.
  await write('src/style.css', "@import 'tailwindcss';\n@import './styles/sui-theme.css';\n@source '.';\n")
  await run(['bun', 'install'], app)
  await run(['bunx', 'vue-tsc', '--noEmit'], app)
  await run(['bunx', 'vite', 'build'], app)
  console.log(`smoke ok: ${components.length} components installed, typechecked and built`)
} finally {
  server?.stop(true)
  await rm(reg, { recursive: true, force: true })
  await rm(app, { recursive: true, force: true })
}
