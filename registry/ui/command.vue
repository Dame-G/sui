<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import Kbd from '@/components/ui/kbd.vue'
import Spinner from '@/components/ui/spinner.vue'
import { announce } from '@/lib/announce'

export interface CommandItem {
  value: string
  label: string
  group?: string
  /** Keys shown at the end of the row, one chip each. */
  shortcut?: string[]
  /** A second, quieter line under the label. */
  description?: string
  /** SVG path data on a 24px grid, drawn as a 1.75-stroke icon. */
  icon?: string
  /** Extra words that find the item without showing. */
  keywords?: string[]
  disabled?: boolean
  /** Selecting it opens these as the next page instead of running it. */
  children?: CommandItem[]
}

const props = withDefaults(
  defineProps<{
    items: CommandItem[]
    placeholder?: string
    /** The title of the empty state. Default: Nothing called “what you typed”. */
    empty?: string
    /** Your own matching (fuzzy, by keyword...). Default: every word of the query is found in the label, keywords or description, ignoring case and accents. */
    filter?: (item: CommandItem, query: string) => boolean
    /** Results are on their way: shows a busy row and sets aria-busy. */
    loading?: boolean
  }>(),
  { placeholder: 'Type a command or search…' },
)
const emit = defineEmits<{ select: [value: string] }>()
const open = defineModel<boolean>('open', { default: false })

const query = ref('')
const stack = ref<CommandItem[]>([])
const pressed = ref('')
const inputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)
const rootRef = ref<{ highlightFirstItem?: () => void } | null>(null)
// The first result is always the highlighted one, so Enter does the obvious thing.
const highlightFirst = () => nextTick(() => requestAnimationFrame(() => rootRef.value?.highlightFirstItem?.()))
let returnTo: HTMLElement | null = null

// Remember who had focus, so closing puts it back there (the palette has no trigger of its own).
watch(
  open,
  (o) => {
    if (o) {
      returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
      query.value = ''
      stack.value = []
      pressed.value = ''
    }
  },
  { flush: 'sync' },
)

// ---- matching: accent- and case-insensitive; one character in, one character out, so match positions line up with the label.
const fold = (c: string) => (c.normalize('NFD')[0] ?? c).toLowerCase().charAt(0)
const foldAll = (s: string) => Array.from(s).map(fold).join('')
const isWord = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c)

interface Hit {
  item: CommandItem
  parts: { text: string; hit: boolean }[]
  score: number
  index: number
}

function match(item: CommandItem, tokens: string[], index: number): Hit | null {
  const chars = Array.from(item.label)
  const label = chars.map(fold).join('')
  const mark = new Array<boolean>(chars.length).fill(false)
  let score = 0
  for (const t of tokens) {
    const at = label.indexOf(t)
    if (at >= 0) {
      score += at === 0 ? 0 : isWord(label[at - 1]) ? 2 : 1
      for (let i = at; i < at + t.length; i++) mark[i] = true
      continue
    }
    const rest = foldAll([...(item.keywords ?? []), item.description ?? '', item.group ?? ''].join(' '))
    if (!rest.includes(t)) return null
    score += 3
  }
  const parts: Hit['parts'] = []
  chars.forEach((c, i) => {
    const last = parts[parts.length - 1]
    if (last && last.hit === mark[i]) last.text += c
    else parts.push({ text: c, hit: mark[i]! })
  })
  return { item, parts, score, index }
}

const page = computed(() => (stack.value.length ? stack.value[stack.value.length - 1]!.children ?? [] : props.items))
const groups = computed(() => {
  const q = query.value.trim()
  const tokens = foldAll(q).split(/\s+/).filter(Boolean)
  let hits: Hit[]
  if (props.filter) {
    hits = page.value.filter((i) => props.filter!(i, q)).map((item, index) => ({ item, parts: [{ text: item.label, hit: false }], score: 0, index }))
  } else {
    hits = page.value.flatMap((item, index) => {
      const h = tokens.length ? match(item, tokens, index) : { item, parts: [{ text: item.label, hit: false }], score: 0, index }
      return h ? [h] : []
    })
    if (tokens.length) hits.sort((a, b) => a.score - b.score || a.index - b.index)
  }
  const map = new Map<string, Hit[]>()
  for (const h of hits) map.set(h.item.group ?? '', [...(map.get(h.item.group ?? '') ?? []), h])
  return [...map.entries()].map(([name, rows]) => ({ name, rows }))
})
const total = computed(() => groups.value.reduce((n, g) => n + g.rows.length, 0))
// When some rows have an icon, the rest keep its column, so every label starts on the same line.
const hasIcons = computed(() => page.value.some((i) => i.icon))
const crumb = computed(() => stack.value.map((s) => s.label))

// Say what is on screen once (a burst collapses to the last message): results while typing, the page's size when it changes.
watch([total, query, () => stack.value.length], () => {
  if (!open.value) return
  if (query.value) announce(total.value ? `${total.value} result${total.value === 1 ? '' : 's'}` : emptyTitle.value)
  else if (stack.value.length) announce(`${crumb.value.join(', ')}, ${total.value} item${total.value === 1 ? '' : 's'}`)
})

const emptyTitle = computed(() => props.empty ?? (query.value.trim() ? `Nothing called “${query.value.trim()}”` : 'Nothing here yet'))

// ---- actions
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function choose(item: CommandItem) {
  if (item.disabled) return
  if (item.children?.length) {
    stack.value = [...stack.value, item]
    query.value = ''
    await nextTick()
    inputRef.value?.$el?.focus?.()
    highlightFirst()
    return
  }
  // The row sinks for one tap-length beat, so the choice is seen before the palette goes.
  pressed.value = item.value
  const tap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-tap')) || 0
  await pause(Math.min(tap, 200))
  emit('select', item.value)
  open.value = false
}
function back() {
  stack.value = stack.value.slice(0, -1)
  query.value = ''
  inputRef.value?.$el?.focus?.()
  highlightFirst()
}
function clear() {
  query.value = ''
  inputRef.value?.$el?.focus?.()
}
function onEscape(e: KeyboardEvent) {
  // Esc takes back the text first; only an empty field closes the palette.
  if (query.value) {
    e.preventDefault()
    e.stopPropagation()
    query.value = ''
  } else open.value = false
}
function onBackspace(e: KeyboardEvent) {
  if (!query.value && stack.value.length) {
    e.preventDefault()
    back()
  }
}
function onCloseFocus(e: Event) {
  e.preventDefault()
  returnTo?.focus?.()
}
function onOpenFocus(e: Event) {
  e.preventDefault()
  nextTick(() => inputRef.value?.$el?.focus?.())
  highlightFirst()
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-[sui-fade-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-fade-in_var(--duration-fade)_var(--ease-out)]"
      />
      <!-- The palette is one panel; every part inside draws its own corners, so nothing is clipped. -->
      <DialogContent
        class="fixed top-3 left-1/2 z-50 w-[min(38rem,calc(100vw-1rem))] -translate-x-1/2 rounded-md bg-surface text-ink shadow-float sm:top-[16%] data-[state=closed]:animate-[sui-dialog-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-dialog-in_var(--duration-fade)_var(--ease-out)]"
        @open-auto-focus="onOpenFocus"
        @close-auto-focus="onCloseFocus"
      >
        <DialogTitle class="sr-only">Command palette</DialogTitle>
        <DialogDescription class="sr-only">Type to search, use the arrow keys to move and press enter to run the highlighted command.</DialogDescription>
        <ComboboxRoot ref="rootRef" :open="true" loop :ignore-filter="true" :reset-search-term-on-select="false">
          <div class="flex items-center gap-2 border-b border-edge ps-4 pe-1">
            <button v-if="stack.length" type="button" :aria-label="`Back to ${stack.length > 1 ? crumb[crumb.length - 2] : 'all commands'}`" class="field-action me-0" @click="back">
              <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            </button>
            <svg v-else class="size-5 shrink-0 text-muted" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span v-if="stack.length" class="inline-flex h-chip shrink-0 items-center rounded-sm border border-edge-strong bg-surface-tint px-2 text-sm font-medium">{{ crumb[crumb.length - 1] }}</span>
            <ComboboxInput
              ref="inputRef"
              v-model="query"
              :placeholder="props.placeholder"
              :aria-label="stack.length ? `${crumb[crumb.length - 1]}: ${props.placeholder}` : props.placeholder"
              class="h-control min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
              @keydown.esc="onEscape"
              @keydown.backspace="onBackspace"
            />
            <button v-if="query" type="button" aria-label="Clear search" class="field-action me-0" @click="clear">
              <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
            </button>
            <Kbd v-else class="me-3 shrink-0 pointer-coarse:hidden" aria-hidden="true">esc</Kbd>
          </div>

          <!-- A fixed-height results area: filtering never makes the palette jump. -->
          <ComboboxContent
            :force-mount="true"
            position="inline"
            :aria-busy="props.loading ? true : undefined"
            class="h-[min(24rem,55dvh)] scroll-py-1 overflow-auto overscroll-contain p-1"
          >
            <div v-if="props.loading" class="grid h-full place-items-center"><Spinner label="Searching…" /></div>
            <div v-else-if="!total" class="grid h-full place-content-center gap-1 px-6 text-center">
              <p class="font-medium">{{ emptyTitle }}</p>
              <p v-if="query.trim() || stack.length" class="text-sm text-muted">Try fewer letters, or check the spelling.</p>
            </div>
            <ComboboxGroup v-for="g in groups" :key="g.name" class="grid gap-px">
              <ComboboxLabel v-if="g.name" class="section-label px-3 pt-4 pb-1.5 first:pt-2">{{ g.name }}</ComboboxLabel>
              <ComboboxItem
                v-for="{ item, parts } in g.rows"
                :key="item.value"
                :value="item.value"
                :disabled="item.disabled"
                :data-pressed="pressed === item.value ? '' : undefined"
                class="command-row"
                @select.prevent="choose(item)"
              >
                <span v-if="!item.icon && hasIcons" class="size-5 shrink-0" aria-hidden="true" />
                <svg v-if="item.icon" viewBox="0 0 24 24" class="command-icon size-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="item.icon" /></svg>
                <span class="grid min-w-0 flex-1 gap-0.5">
                  <span class="truncate"><template v-for="(p, i) in parts" :key="i"><mark v-if="p.hit" class="bg-transparent font-strong text-ink underline decoration-primary decoration-2 underline-offset-4">{{ p.text }}</mark><template v-else>{{ p.text }}</template></template></span>
                  <span v-if="item.description" class="truncate text-sm text-muted">{{ item.description }}</span>
                </span>
                <svg v-if="item.children?.length" viewBox="0 0 24 24" class="size-5 shrink-0 text-muted rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                <span v-else-if="item.shortcut?.length" class="flex shrink-0 gap-1 pointer-coarse:hidden" aria-hidden="true"><Kbd v-for="k in item.shortcut" :key="k">{{ k }}</Kbd></span>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxContent>

          <!-- Key hints are for keyboards: gone on touch and on narrow screens. -->
          <div class="hidden items-center gap-4 border-t border-edge px-4 py-2 text-sm text-muted sm:flex pointer-coarse:hidden" aria-hidden="true">
            <span class="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
            <span class="flex items-center gap-1.5"><Kbd>↵</Kbd> {{ groups.some((g) => g.rows.some((r) => r.item.children?.length)) ? 'open' : 'run' }}</span>
            <span v-if="stack.length" class="flex items-center gap-1.5"><Kbd>⌫</Kbd> back</span>
            <span class="flex items-center gap-1.5"><Kbd>esc</Kbd> {{ query ? 'clear' : 'close' }}</span>
            <span v-if="!props.loading" class="numeral ms-auto">{{ total }} {{ total === 1 ? 'result' : 'results' }}</span>
          </div>
        </ComboboxRoot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
