<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import { announce } from '@/lib/announce'
import Field from '@/components/ui/field.vue'
import Spinner from '@/components/ui/spinner.vue'

const props = defineProps<{
  /** `group` puts options under a heading (options of one group should sit together); `description` is a second line. */
  options: { value: string; label: string; description?: string; group?: string; disabled?: boolean }[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  optional?: boolean
  /** Show a clear button once something is picked. */
  clearable?: boolean
  /** Options are on their way: shows a spinner, sets aria-busy, and the empty row says Loading. */
  loading?: boolean
  /** The text of the empty row. */
  emptyText?: string
  /** Accept whatever is typed (Enter or leaving the field commits it) as well as the listed options. */
  freeform?: boolean
  /** Pick several: the model is then a string[] and the picks show as chips in the field. */
  multiple?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string | string[]>()
const search = ref('')
if (props.multiple && !Array.isArray(model.value)) model.value = model.value ? [model.value] : []

const picked = computed(() => (Array.isArray(model.value) ? model.value : []))
function drop(v: string) {
  model.value = picked.value.filter((x) => x !== v)
}
// Backspace in an empty field takes the last chip back out.
function onBackspace() {
  if (props.multiple && !search.value && picked.value.length) drop(picked.value[picked.value.length - 1]!)
}
// After a pick the list stays open, so clear what was typed to show every option again.
watch(model, () => props.multiple && (search.value = ''))

// Filter by label ourselves, so typing matches what people read rather than the stored value.
// Accent-insensitive, so "cafe" finds "Café".
const fold = (t: string) => t.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const matches = computed(() => {
  const q = fold(search.value.trim())
  return q ? props.options.filter((o) => fold(o.label).includes(q) || (o.description && fold(o.description).includes(q))) : props.options
})
const shown = matches
// Group headings in order of first appearance; options without a group come first, unlabelled.
const groups = computed(() => {
  const out: { name?: string; items: typeof shown.value }[] = []
  for (const o of shown.value) {
    let g = out.find((x) => x.name === o.group)
    if (!g) out.push((g = { name: o.group, items: [] }))
    g.items.push(o)
  }
  return out
})
const labelOf = (v: unknown) => props.options.find((o) => o.value === v)?.label ?? (props.freeform && typeof v === 'string' ? v : '')

const hasValue = computed(() => (props.multiple ? picked.value.length > 0 : !!model.value))
function clear() {
  model.value = props.multiple ? [] : undefined
  search.value = ''
}

// Freeform: Enter, or leaving the field, keeps what was typed when it is not one of the options.
function commitTyped() {
  const text = search.value.trim()
  if (!props.freeform || !text) return false
  const exact = props.options.find((o) => fold(o.label) === fold(text))
  const value = exact?.value ?? text
  if (props.multiple) {
    if (!picked.value.includes(value)) model.value = [...picked.value, value]
  } else model.value = value
  search.value = ''
  return true
}
function onEnter(e: KeyboardEvent) {
  if (props.freeform && search.value.trim() && !matches.value.length && commitTyped()) e.preventDefault()
}
function onBlur() {
  if (props.freeform && !props.multiple && search.value.trim() && search.value.trim() !== labelOf(model.value)) commitTyped()
}

// Tell screen readers how many options match as you type.
watch(search, (q) => {
  if (!q) return
  const n = matches.value.length
  announce(n === 0 ? 'No results' : n === 1 ? '1 result' : `${n} results`)
})
</script>

<template>
  <Field
    v-slot="{ id, describedby, invalid }"
    :label="props.label ?? props.placeholder ?? 'Options'"
    :hide-label="!props.label"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :optional="props.optional"
    :disabled="props.disabled"
    :class="props.class"
  >
    <ComboboxRoot v-model="model" ignore-filter :multiple="props.multiple" :disabled="props.disabled">
      <ComboboxAnchor
        :data-invalid="invalid ? '' : undefined"
        :class="
          cn(
            // the well, with the chips and the input inside it and the chevron at the end
            'well group flex w-full min-w-0 cursor-text items-center focus-within:border-primary focus-within:[--_veil:transparent] focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
            'data-[invalid]:border-danger data-[invalid]:focus-within:outline-danger',
            props.multiple ? 'min-h-control [--_py:calc((var(--spacing-control)-var(--spacing-chip))/2-var(--stroke-edge))] ps-[calc(0.5rem-var(--stroke-edge))]' : 'h-control',
            'has-[:disabled]:cursor-not-allowed has-[:disabled]:border-transparent has-[:disabled]:bg-transparent has-[:disabled]:text-muted has-[:disabled]:outline-1 has-[:disabled]:-outline-offset-1 has-[:disabled]:outline-edge-strong has-[:disabled]:outline-dashed has-[:disabled]:[box-shadow:none]',
          )
        "
      >
        <div :class="cn('flex min-w-0 flex-1 items-center', props.multiple && 'flex-wrap gap-1.5 py-(--_py)')">
          <!-- A chip is a small stamp: tinted face, 1px edge, remove button on its end (the same as the tags input). -->
          <span
            v-for="v in props.multiple ? picked : []"
            :key="v"
            class="inline-flex h-chip items-center gap-1 rounded-sm border border-edge-strong bg-surface-tint ps-2 pe-0.5 text-sm font-medium text-ink"
          >
            {{ labelOf(v) }}
            <button
              type="button"
              :aria-label="`Remove ${labelOf(v)}`"
              :disabled="props.disabled"
              class="inline-grid size-4 cursor-pointer place-items-center rounded-sm transition-state hover:bg-wash-press focus-ring disabled:cursor-not-allowed"
              @mousedown.prevent
              @click="drop(v)"
            >
              <svg viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </span>
          <ComboboxInput
            :id="id"
            v-model="search"
            :display-value="(v: unknown) => (props.multiple ? '' : labelOf(v))"
            :placeholder="props.placeholder ?? 'Search…'"
            :aria-invalid="invalid ? true : undefined"
            :aria-describedby="describedby"
            :aria-busy="props.loading ? true : undefined"
            :class="
              cn(
                'min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted disabled:cursor-not-allowed',
                props.multiple ? 'h-chip min-w-24 px-1.5' : 'h-full ps-[calc(1rem-var(--stroke-edge))] pe-2',
              )
            "
            @keydown.backspace="onBackspace"
            @keydown.enter="onEnter"
            @blur="onBlur"
          />
        </div>
        <div class="flex shrink-0 items-center" :class="props.multiple && 'self-start'">
          <Spinner v-if="props.loading" class="me-1 shrink-0 [&_svg]:size-5" />
          <button
            v-if="props.clearable && hasValue && !props.disabled"
            type="button"
            aria-label="Clear"
            class="well-button size-9"
            @mousedown.prevent
            @click="clear"
          >
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <ComboboxTrigger
            aria-label="Show options"
            class="well-button me-1 size-tap disabled:cursor-not-allowed"
          >
            <svg class="size-5 transition-transform group-has-[[data-state=open]]:rotate-180" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </ComboboxTrigger>
        </div>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          position="popper"
          :side-offset="4"
          class="panel w-(--reka-combobox-trigger-width) p-1"
        >
          <ComboboxViewport class="grid max-h-64 gap-px overflow-auto">
            <ComboboxEmpty class="px-3 py-3 text-center text-muted">{{ props.loading ? 'Loading…' : (props.emptyText ?? 'No results') }}</ComboboxEmpty>
            <ComboboxGroup v-for="g in groups" :key="g.name ?? ''" class="grid gap-px">
              <ComboboxLabel v-if="g.name" class="kicker px-3 pt-2 pb-1">{{ g.name }}</ComboboxLabel>
              <ComboboxItem
                v-for="o in g.items"
                :key="o.value"
                :value="o.value"
                :disabled="o.disabled"
                class="menu-item"
              >
                <span class="grid min-w-0">
                  <span>{{ o.label }}</span>
                  <span v-if="o.description" class="text-sm font-normal text-muted">{{ o.description }}</span>
                </span>
                <ComboboxItemIndicator class="flex text-primary">
                  <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </Field>
</template>