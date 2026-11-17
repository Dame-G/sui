<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { components, groups } from '@registry/components'
import { route } from '@/site/router'
import { resolvedScheme, theme } from '@/site/theme'
import Mark from '@/site/Mark.vue'
import Home from '@/pages/Home.vue'
import Button from '@/components/ui/button.vue'
import IconButton from '@/components/ui/icon-button.vue'
import Command from '@/components/ui/command.vue'
import Kbd from '@/components/ui/kbd.vue'
import Link from '@/components/ui/link.vue'
import NavList from '@/components/ui/nav-list.vue'
import SkipLink from '@/components/ui/skip-link.vue'
import Sheet from '@/components/ui/sheet.vue'
import Toaster from '@/components/ui/toast.vue'
import Tooltip from '@/components/ui/tooltip.vue'

const Components = defineAsyncComponent(() => import('@/pages/Components.vue'))
const Blocks = defineAsyncComponent(() => import('@/pages/Blocks.vue'))
const Start = defineAsyncComponent(() => import('@/pages/Start.vue'))
const Style = defineAsyncComponent(() => import('@/pages/Style.vue'))
const Theme = defineAsyncComponent(() => import('@/pages/Theme.vue'))

const pages = { home: Home, start: Start, theme: Theme, style: Style, components: Components, blocks: Blocks }
const current = computed(() => pages[route.value.page as keyof typeof pages] ?? Home)

const nav = [
  { value: 'start', label: 'Start', href: '#/start' },
  { value: 'theme', label: 'Theme', href: '#/theme' },
  { value: 'style', label: 'Style', href: '#/style' },
  { value: 'components', label: 'Components', href: '#/components' },
  { value: 'blocks', label: 'Blocks', href: '#/blocks' },
]
const sections = [{ items: nav }]

// The search palette: every page and every component, one keystroke away.
function toggleScheme() {
  theme.scheme = resolvedScheme.value === 'dark' ? 'light' : 'dark'
}
const searchOpen = ref(false)
const menuOpen = ref(false)
const commands = [
  ...nav.map((n) => ({ value: n.href, label: n.label, group: 'Pages' })),
  ...groups.flatMap((g) =>
    components.filter((c) => c.group === g).map((c) => ({ value: `#/components/${c.name}`, label: c.title, group: g })),
  ),
]
function go(href: string) {
  location.hash = href
}
function onKey(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}
onMounted(() => addEventListener('keydown', onKey))
onBeforeUnmount(() => removeEventListener('keydown', onKey))
// The menu sheet closes itself when you land somewhere.
watch(route, () => (menuOpen.value = false))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <SkipLink />
    <header class="site-header sticky top-0 z-40 border-b-(length:--depth) border-edge-strong bg-surface print:hidden">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="#/" class="heading focus-ring flex items-center gap-2 rounded-md text-2xl" aria-label="sui home">
          <Mark class="size-8" />
          sui
        </a>

        <div class="flex items-center gap-3">
          <div class="hidden lg:block"><NavList :model-value="route.page" :sections="sections" orientation="horizontal" label="Main" /></div>

          <Tooltip content="Search pages and components">
            <button
              type="button"
              class="well hidden h-control cursor-pointer items-center gap-3 px-4 text-muted sm:inline-flex"
              @click="searchOpen = true"
            >
              <svg viewBox="0 0 256 256" class="size-4 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
              Search
              <span class="flex gap-1"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
            </button>
          </Tooltip>

          <IconButton :label="resolvedScheme === 'dark' ? 'Switch to light scheme' : 'Switch to dark scheme'" class="print:hidden" @click="toggleScheme">
            <svg viewBox="0 0 256 256" class="size-5" fill="currentColor" aria-hidden="true">
              <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
            </svg>
          </IconButton>

          <div class="lg:hidden">
            <Sheet v-model:open="menuOpen" title="Menu" description="Where to go on this site.">
              <template #trigger><Button>Menu</Button></template>
              <div class="grid gap-4">
                <NavList :model-value="route.page" :sections="sections" label="Main" />
                <Button @click="(menuOpen = false), (searchOpen = true)">Search components</Button>
              </div>
            </Sheet>
          </div>
        </div>
      </div>
    </header>

    <Command v-model:open="searchOpen" :items="commands" placeholder="Search pages and components…" @select="go" />
    <Toaster />

    <main id="main" tabindex="-1" class="flex grow flex-col outline-none"><component :is="current" /></main>

    <footer class="site-footer border-t border-edge bg-surface">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm text-muted">
        <span class="flex items-center gap-2"><Mark class="size-5" /> sui, simple ui. Components you own, a look you theme.</span>
        <span>Built on <Link href="https://reka-ui.com" external>Reka UI</Link> and <Link href="https://tailwindcss.com" external>Tailwind</Link></span>
      </div>
    </footer>
  </div>
</template>
