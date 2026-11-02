<script setup lang="ts">
import { computed, ref, useId, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface ListItem {
  value: string
  title: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: ListItem[]
    /** Names the list for screen readers. */
    label: string
    /** `select` marks the chosen rows with a tick, like a choice. `current` marks the row you are in with the primary edge, like a place. */
    mode?: 'select' | 'current'
    /** Choosing follows the arrow keys, so moving is choosing. Without it, Enter or Space chooses. */
    followFocus?: boolean
    /** Message when there are no items. */
    empty?: string
    loading?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { mode: 'select' },
)
const model = defineModel<string>()
defineSlots<{
  /** Content at the end of a row, such as a date or a badge. */
  trailing?(props: { item: ListItem; selected: boolean }): unknown
}>()

const uid = useId()
const idOf = (i: number) => `${uid}-${i}`
const enabled = computed(() => props.items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0))
// The list is one tab stop. `active` is the row the arrow keys are on, reported through aria-activedescendant.
const active = ref(Math.max(0, props.items.findIndex((it) => it.value === model.value)))
const hasFocus = ref(false)

function move(to: number) {
  if (to < 0) return
  active.value = to
  if (props.followFocus) model.value = props.items[to]!.value
  document.getElementById(idOf(to))?.scrollIntoView({ block: 'nearest' })
}
function step(dir: 1 | -1) {
  const at = enabled.value.indexOf(active.value)
  const next = enabled.value[Math.min(enabled.value.length - 1, Math.max(0, at + dir))]
  move(next ?? -1)
}
let buffer = ''
let clear: ReturnType<typeof setTimeout> | undefined
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') step(1)
  else if (e.key === 'ArrowUp') step(-1)
  else if (e.key === 'Home') move(enabled.value[0] ?? -1)
  else if (e.key === 'End') move(enabled.value[enabled.value.length - 1] ?? -1)
  else if (e.key === 'Enter' || e.key === ' ') {
    if (buffer && e.key === ' ') buffer += ' '
    else model.value = props.items[active.value]?.value
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // typeahead: type the start of a title to jump to it
    buffer += e.key.toLowerCase()
    clearTimeout(clear)
    clear = setTimeout(() => (buffer = ''), 600)
    const from = enabled.value.indexOf(active.value)
    const order = [...enabled.value.slice(from + (buffer.length === 1 ? 1 : 0)), ...enabled.value.slice(0, from + 1)]
    move(order.find((i) => props.items[i]!.title.toLowerCase().startsWith(buffer)) ?? -1)
  } else return
  e.preventDefault()
}
function choose(i: number) {
  if (props.items[i]!.disabled) return
  active.value = i
  model.value = props.items[i]!.value
}
const isSelected = (it: ListItem) => it.value === model.value
</script>

<template>
  <div v-if="props.loading" class="grid gap-3 p-4" role="status" aria-busy="true">
    <span v-for="i in 3" :key="i" aria-hidden="true" class="block h-4 animate-pulse-soft rounded-sm bg-surface-tint" :class="i === 2 ? 'w-1/2' : 'w-3/4'" />
    <span class="sr-only">Loading…</span>
  </div>
  <p v-else-if="!props.items.length" :class="cn('px-4 py-10 text-center text-muted', props.class)">{{ props.empty ?? 'Nothing to show.' }}</p>
  <div
    v-else
    role="listbox"
    tabindex="0"
    :aria-label="props.label"
    :aria-activedescendant="hasFocus ? idOf(active) : undefined"
    :class="cn('grid content-start gap-1 rounded-md bg-surface p-2 outline-none', props.class)"
    @keydown="onKey"
    @focus="hasFocus = true"
    @blur="hasFocus = false"
  >
    <div
      v-for="(item, i) in props.items"
      :id="idOf(i)"
      :key="item.value"
      role="option"
      :aria-selected="isSelected(item)"
      :aria-disabled="item.disabled || undefined"
      :data-active="hasFocus && active === i ? '' : undefined"
      :data-selected="isSelected(item) ? '' : undefined"
      :class="
        cn(
          'flex min-h-control cursor-pointer items-center gap-3 py-2 text-start leading-tight text-ink transition-state select-none',
          'hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] hover:[background-color:var(--color-wash-hover)] active:[background-color:var(--color-wash-press)]',
          'data-[active]:outline-2 data-[active]:-outline-offset-1 data-[active]:outline-primary',
          'aria-disabled:cursor-not-allowed aria-disabled:text-muted aria-disabled:hover:bg-transparent aria-disabled:hover:shadow-none',
          // every row is the same box, so choosing one moves nothing
          props.mode === 'current'
            ? 'edge-start ps-[max(calc(0.75rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] pe-[calc(0.75rem-var(--stroke-edge))] [--_bg:transparent] [--_tone:transparent] data-[selected]:[--_bg:var(--color-primary-soft)] data-[selected]:[--_tone:var(--color-primary)] data-[selected]:hover:shadow-none'
            : 'rounded-md border border-transparent px-[calc(0.75rem-var(--stroke-edge))] data-[selected]:border-primary data-[selected]:bg-primary-soft',
        )
      "
      @click="choose(i)"
    >
      <span class="min-w-0 flex-1">
        <span :class="cn('block truncate', isSelected(item) && 'font-medium text-primary')">{{ item.title }}</span>
        <span v-if="item.description" class="block truncate text-sm text-muted">{{ item.description }}</span>
      </span>
      <slot name="trailing" :item="item" :selected="isSelected(item)" />
      <svg
        v-if="props.mode === 'select' && isSelected(item)"
        viewBox="0 0 256 256"
        class="size-4 shrink-0 text-primary"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
      </svg>
    </div>
  </div>
</template>
