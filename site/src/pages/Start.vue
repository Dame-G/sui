<script setup lang="ts">
import PageHeader from '@/site/PageHeader.vue'
import OnThisPage from '@/site/OnThisPage.vue'
import { ref } from 'vue'
import CodeBlock from '@/components/CodeBlock.vue'
import Accordion from '@/components/ui/accordion.vue'
import Kbd from '@/components/ui/kbd.vue'
import Link from '@/components/ui/link.vue'
import Notice from '@/components/ui/notice.vue'
import Tabs from '@/components/ui/tabs.vue'

const origin = location.origin
const alias = ref('vite')
const aliasTabs = [
  { value: 'vite', label: 'vite.config.ts' },
  { value: 'ts', label: 'tsconfig.json' },
]

const create = `bun create vite my-app --template vue-ts
cd my-app
bun add tailwindcss @tailwindcss/vite`
const viteConfig = `import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})`
const tsconfig = `// in tsconfig.json and tsconfig.app.json, under compilerOptions
"paths": { "@/*": ["./src/*"] }`
const componentsJson = `{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": { "config": "", "css": "src/style.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "composables": "@/composables",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}`
const add = `bunx shadcn-vue@latest add \\
  ${origin}/r/button.json \\
  ${origin}/r/text-field.json \\
  ${origin}/r/dialog.json`
const theme = `@import "tailwindcss";
@import "./styles/sui-theme.css";`
const use = `<script setup lang="ts">
import Button from '@/components/ui/button.vue'
<\/script>

<template>
  <Button>Hello</Button>
</template>`

const steps = [
  { title: 'Create an app', body: 'Any Vite, Vue and TypeScript project works.' },
  { title: 'Set up the @ alias', body: 'The CLI reads your vite config and tsconfig to decide where files go.' },
  { title: 'Add a components.json', body: 'It is all the CLI needs.' },
  { title: 'Add components', body: 'Each one brings its npm dependencies, the cn helper and the theme file. Add as many as you like in one command.' },
  { title: 'Import the theme', body: 'In src/style.css, after Tailwind.' },
  { title: 'Use them', body: 'They live in your project now. Edit them freely.' },
]

const faq = [
  { value: 'lint', title: 'Lint how components are used' },
  { value: 'dark', title: 'Dark mode and high contrast' },
  { value: 'ai', title: 'Docs for AI assistants' },
  { value: 'fonts', title: 'Fonts' },
]
const lint = `bun add -D @shadcn/lint eslint @typescript-eslint/parser vue-eslint-parser

// eslint.config.mjs
import { plugin as shadcn } from '@shadcn/lint'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import vueParser from 'vue-eslint-parser'

export default defineConfig([
  {
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser, parserOptions: { parser: tsParser } },
    plugins: { shadcn },
    settings: { shadcn: { ui: '@/components/ui' } },
    rules: {
      'shadcn/no-restyle': ['error', { allow: ['layout'] }],
      'shadcn/no-raw-colors': 'error',
      'shadcn/no-arbitrary-values': 'error',
      'shadcn/no-inline-styles': 'error',
    },
  },
  // The component source is yours to edit freely.
  { files: ['src/components/ui/**/*.vue'], rules: { 'shadcn/no-restyle': 'off', 'shadcn/no-arbitrary-values': 'off', 'shadcn/no-inline-styles': 'off' } },
])`
const names = ['Create the app', 'Set the alias', 'Add components.json', 'Add components', 'Import the theme', 'Use them']
const toc = [...steps.map((_, i) => ({ id: `step-${i + 1}`, label: names[i] ?? '' })), { id: 'step-optional', label: 'Optional' }]
</script>

<template>
  <div class="flex flex-col">
    <PageHeader kicker="Start" title="Get started">sui is a registry, not a package. The <Link href="https://www.shadcn-vue.com" external>shadcn-vue</Link> CLI copies
        components into your project and they become your code. Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> here to jump to any one.</PageHeader>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row">
      <div class="flex min-w-0 grow flex-col gap-12">

    <ol class="flex flex-col gap-10">
      <li v-for="(s, i) in steps" :id="`step-${i + 1}`" :key="s.title" class="flex gap-5">
        <span class="slab slab-primary slab-thin numeral grid size-tap shrink-0 place-items-center bg-primary text-on-primary">{{ i + 1 }}</span>
        <div class="flex min-w-0 grow flex-col gap-3 pt-2">
          <h2 class="heading text-xl">{{ s.title }}</h2>
          <p class="text-muted">{{ s.body }}</p>
          <template v-if="i === 0"><CodeBlock :code="create" lang="bash" /></template>
          <template v-else-if="i === 1">
            <Tabs v-model="alias" :tabs="aliasTabs">
              <template #vite><CodeBlock :code="viteConfig" lang="typescript" /></template>
              <template #ts><CodeBlock :code="tsconfig" lang="json" /></template>
            </Tabs>
          </template>
          <template v-else-if="i === 2"><CodeBlock :code="componentsJson" lang="json" /></template>
          <template v-else-if="i === 3">
            <CodeBlock :code="add" lang="bash" />
            <Notice tone="warning" title="Skip shadcn-vue init">It installs shadcn's own base style, which would sit on top of sui.</Notice>
          </template>
          <template v-else-if="i === 4"><CodeBlock :code="theme" lang="css" /></template>
          <template v-else><CodeBlock :code="use" lang="vue" /></template>
        </div>
      </li>
    </ol>

    <section id="step-optional" class="flex flex-col gap-4">
      <h2 class="heading text-2xl">Optional</h2>
      <Accordion :items="faq">
        <template #lint>
          <div class="flex flex-col gap-3">
            <p>
              Pages may position sui components with layout classes but not restyle them. Errors explain the fix, which keeps
              people and coding agents on the system. <Link href="https://github.com/shadcn-ui/lint" external>@shadcn/lint</Link>
              does the checking. Templates need ESLint: Oxlint only reads script blocks.
            </p>
            <CodeBlock :code="lint" lang="typescript" />
          </div>
        </template>
        <template #dark>
          <p>
            The theme ships a dark palette and a high-contrast mode, both off until you ask. Put
            <code class="numeral">data-scheme="dark"</code> (or <code class="numeral">"auto"</code> to follow the system) and
            <code class="numeral">data-contrast="high"</code> on <code class="numeral">&lt;html&gt;</code>. Try them on the
            <Link href="#/theme">Theme page</Link>.
          </p>
        </template>
        <template #ai>
          <p>
            Every component has a plain-text page with its install command, props and an example. Point your assistant at
            <Link href="/llms.txt" external>/llms.txt</Link> (the index), <Link href="/llms-full.txt" external>/llms-full.txt</Link>
            (everything), or one page like <code class="numeral">/llms/button.txt</code>. <code class="numeral">bun run registry:build</code> rebuilds them.
          </p>
        </template>
        <template #fonts>
          <p>
            The theme falls back to system fonts. This site self-hosts Bricolage Grotesque and Geist Mono. To use yours, point
            <code class="numeral">--font-sans</code> and <code class="numeral">--font-mono</code> at them in your theme.
          </p>
        </template>
      </Accordion>
    </section>
  </div>
      <aside class="hidden lg:block lg:w-64 lg:shrink-0"><OnThisPage :items="toc" /></aside>
    </div>
  </div>
</template>
