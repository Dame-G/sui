<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { components, groups } from '@registry/components'
import api from 'virtual:sui-props'
import { route } from '@/site/router'
import CodeBlock from '@/components/CodeBlock.vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import ButtonGroup from '@/components/ui/button-group.vue'
import Collapsible from '@/components/ui/collapsible.vue'
import NavList from '@/components/ui/nav-list.vue'
import Link from '@/components/ui/link.vue'
import ScrollArea from '@/components/ui/scroll-area.vue'
import DataTable from '@/components/ui/data-table.vue'
import SearchField from '@/components/ui/search-field.vue'
import Tabs from '@/components/ui/tabs.vue'

// Loaded on demand, so the page ships one demo and its sources, not all 76.
const demos = import.meta.glob('../demos/*.vue', { import: 'default' }) as Record<string, () => Promise<object>>
const demoSrc = import.meta.glob('../demos/*.vue', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const uiSrc = import.meta.glob('../../../registry/ui/*.vue', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

const index = computed(() => Math.max(0, components.findIndex((c) => c.name === route.value.param)))
const current = computed(() => components[index.value]!)
const prev = computed(() => components[index.value - 1])
const next = computed(() => components[index.value + 1])
const demo = computed(() => {
  const load = demos[`../demos/${current.value.name}.vue`]
  return load ? defineAsyncComponent(load) : undefined
})
const usage = ref('')
const source = ref('')
watch(
  () => current.value.name,
  async (name) => {
    usage.value = ''
    source.value = ''
    const [u, s] = await Promise.all([demoSrc[`../demos/${name}.vue`]?.() ?? '', uiSrc[`../../../registry/ui/${name}.vue`]?.() ?? ''])
    if (name === current.value.name) [usage.value, source.value] = [u, s]
  },
  { immediate: true },
)
const install = computed(() => `bunx shadcn-vue@latest add ${location.origin}/r/${current.value.name}.json`)

// The API, read from the component's own source (props, v-model, events, slots).
const apiOf = computed(() => api[current.value.name] ?? { props: [], models: [], events: [], slots: [], extends: [] })
const propColumns = [
  { key: 'name', label: 'Prop' },
  { key: 'type', label: 'Type' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'What it does' },
]
const propRows = computed(() => [
  ...apiOf.value.models.map((m) => ({
    name: m.name === 'modelValue' ? 'v-model' : `v-model:${m.name}`,
    type: m.type,
    default: m.default ?? '',
    description: 'Two-way bound value.',
  })),
  ...apiOf.value.props
    .filter((p) => p.name !== 'class')
    .map((p) => ({ name: p.required ? `${p.name} (required)` : p.name, type: p.type, default: p.default ?? '', description: p.description ?? '' })),
])

/** `icon-button` -> `IconButton`: the name you import. */
const pascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())
const squash = (s: string) => s.toLowerCase().replace(/[\s-]/g, '')
const filter = ref('')
const sections = groups.map((g) => ({
  title: g,
  items: components.filter((c) => c.group === g).map((c) => ({ value: c.name, label: pascal(c.name), title: c.title, href: `#/components/${c.name}` })),
}))
const shown = computed(() => {
  const q = squash(filter.value)
  if (!q) return sections
  return sections.map((s) => ({ ...s, items: s.items.filter((i) => squash(i.label).includes(q) || squash(i.title).includes(q)) })).filter((s) => s.items.length)
})

const npm = computed(() => [...(current.value.plain ? [] : ['reka-ui']), ...(current.value.deps ?? [])])
const also = computed(() => current.value.uses ?? [])

const tabs = [
  { value: 'preview', label: 'Preview' },
  { value: 'usage', label: 'Usage' },
  { value: 'source', label: 'Source' },
]
</script>

<template>
  <div class="docs-row mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:flex-row md:gap-10">
    <!-- Narrow screens fold the list away; wide ones keep it beside the page. -->
    <div class="md:hidden print:hidden">
      <Collapsible title="Browse all components">
        <ScrollArea class="h-72"><NavList :model-value="current.name" :sections="sections" label="Components" /></ScrollArea>
      </Collapsible>
    </div>
    <aside class="side-nav hidden print:hidden md:flex md:w-72 md:shrink-0 md:flex-col md:self-start md:overflow-hidden md:rounded-md md:bg-surface md:shadow-frame">
      <div class="p-3 pb-0"><SearchField v-model="filter" label="Find a component" hide-label placeholder="Find a component" /></div>
      <div class="min-h-0 grow overflow-y-auto overscroll-contain">
        <NavList v-if="shown.length" flush :model-value="current.name" :sections="shown" label="Components" />
        <p v-else class="p-6 text-muted">No component called “{{ filter }}”.</p>
      </div>
    </aside>

    <article :key="current.name" class="flex min-w-0 grow flex-col gap-6">
      <header class="flex flex-col gap-2">
        <p class="kicker">{{ current.group }}</p>
        <h1 class="heading text-5xl">{{ current.title }}</h1>
        <p class="text-lg text-muted">{{ current.description }}</p>
      </header>

      <div class="flex flex-col gap-3">
        <CodeBlock :code="install" lang="bash" />
        <p class="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span class="kicker">Installs with</span>
          <Badge tone="info">theme</Badge>
          <Badge tone="info">utils</Badge>
          <Badge v-for="u in also" :key="u" tone="info">{{ u }}</Badge>
          <Badge v-for="d in npm" :key="d">{{ d }}</Badge>
          <Link :href="`/llms/${current.name}.txt`" external class="ms-auto print:hidden">For AI assistants</Link>
        </p>
      </div>

      <h2 class="sr-only">Preview and code</h2>
      <Tabs :tabs="tabs">
        <template #preview>
          <div class="relative min-h-48 overflow-x-auto rounded-md bg-surface p-6 shadow-frame md:p-10">
            <component :is="demo" />
          </div>
        </template>
        <template #usage><CodeBlock :code="usage" /></template>
        <template #source><CodeBlock :code="source" /></template>
      </Tabs>

      <section class="flex flex-col gap-2">
        <h2 class="heading text-2xl">Props</h2>
        <DataTable v-if="propRows.length" :label="`${current.title} props`" :columns="propColumns" :rows="propRows" dense />
        <p v-else class="text-muted">This component takes no props, only content.</p>
        <p v-if="apiOf.extends.length" class="text-sm text-muted">
          Also takes everything in <code class="numeral">{{ apiOf.extends.join(', ') }}</code>, and a <code class="numeral">class</code> for placement.
        </p>
        <div v-if="apiOf.events.length || apiOf.slots.length" class="flex flex-col gap-2">
          <p v-if="apiOf.events.length" class="flex flex-wrap items-center gap-2">
            <span class="kicker">Events</span>
            <Badge v-for="e in apiOf.events" :key="e.name">{{ e.name }}</Badge>
          </p>
          <p v-if="apiOf.slots.length" class="flex flex-wrap items-center gap-2">
            <span class="kicker">Slots</span>
            <Badge v-for="n in apiOf.slots" :key="n">{{ n }}</Badge>
          </p>
        </div>
      </section>

      <nav aria-label="Previous and next component" class="print:hidden flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup>
          <Button v-if="prev" as="a" :href="`#/components/${prev.name}`">← {{ prev.title }}</Button>
          <Button v-else disabled>← Start</Button>
          <Button v-if="next" as="a" :href="`#/components/${next.name}`">{{ next.title }} →</Button>
          <Button v-else disabled>End →</Button>
        </ButtonGroup>
        <span class="numeral text-sm text-muted">{{ index + 1 }} / {{ components.length }}</span>
      </nav>
    </article>
  </div>
</template>
