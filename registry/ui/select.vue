<script setup lang="ts" generic="T extends string | string[] = string">
import { computed, type HTMLAttributes } from 'vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import Field from '@/components/ui/field.vue'
import Spinner from '@/components/ui/spinner.vue'

const props = defineProps<{
  /** `group` puts options under a heading (keep a group's options together); `description` is a second line. */
  options: { value: string; label: string; description?: string; group?: string; disabled?: boolean }[]
  placeholder?: string
  /** Optional: without one the select carries a hidden label so it still has an accessible name. */
  label?: string
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  /** Pick several: the model is then a string[] and the trigger reads "3 selected". */
  multiple?: boolean
  /** Show a clear button once something is picked. */
  clearable?: boolean
  /** Options are on their way: shows a spinner and sets aria-busy. */
  loading?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<T>()
// Reka takes one value or an array; the generic keeps your v-model typed as string, or string[] with `multiple`.
const inner = computed({
  get: () => model.value as string | string[] | undefined,
  set: (v) => (model.value = v as T),
})

const picked = computed(() => (Array.isArray(model.value) ? model.value : model.value ? [model.value] : []))
const labelOf = (v: string) => props.options.find((o) => o.value === v)?.label ?? v
const summary = computed(() => (picked.value.length > 1 ? `${picked.value.length} selected` : picked.value.length === 1 ? labelOf(picked.value[0]!) : ''))
const hasValue = computed(() => picked.value.length > 0)
const groups = computed(() => {
  const out: { name?: string; items: typeof props.options }[] = []
  for (const o of props.options) {
    let g = out.find((x) => x.name === o.group)
    if (!g) out.push((g = { name: o.group, items: [] }))
    g.items.push(o)
  }
  return out
})
function clear() {
  inner.value = props.multiple ? [] : undefined
}
</script>

<template>
  <Field
    v-slot="{ id, describedby, invalid }"
    :label="props.label ?? props.placeholder ?? 'Select'"
    :hide-label="!props.label"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :optional="props.optional"
    :disabled="props.disabled"
    :class="props.class"
  >
  <div class="relative min-w-0">
    <SelectRoot v-model="inner" :multiple="props.multiple" :disabled="props.disabled">
      <SelectTrigger
        :id="id"
        :aria-invalid="invalid ? true : undefined"
        :aria-describedby="describedby"
        :aria-busy="props.loading ? true : undefined"
        class="well well-trigger"
      >
        <template v-if="props.multiple">
          <span :class="cn('min-w-0 truncate', !hasValue && 'text-muted', props.clearable && hasValue && 'pe-8')">{{ summary || (props.placeholder ?? 'Select…') }}</span>
        </template>
        <SelectValue v-else :placeholder="props.placeholder ?? 'Select…'" :class="cn('min-w-0 truncate', props.clearable && hasValue && 'pe-8')" />
        <Spinner v-if="props.loading" class="shrink-0 [&_svg]:size-5" />
        <svg v-else class="size-5 shrink-0 transition-transform in-data-[state=open]:rotate-180" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="4"
          class="panel w-(--reka-select-trigger-width) p-1"
        >
          <SelectViewport class="grid max-h-72 gap-px">
            <p v-if="!props.options.length" class="px-3 py-3 text-center text-muted">{{ props.loading ? 'Loading…' : 'No options' }}</p>
            <SelectGroup v-for="g in groups" :key="g.name ?? ''" class="grid gap-px">
              <SelectLabel v-if="g.name" class="kicker px-3 pt-2 pb-1">{{ g.name }}</SelectLabel>
              <SelectItem
                v-for="o in g.items"
                :key="o.value"
                :value="o.value"
                :disabled="o.disabled"
                class="menu-item"
              >
                <span class="grid min-w-0">
                  <SelectItemText>{{ o.label }}</SelectItemText>
                  <span v-if="o.description" class="text-sm font-normal text-muted">{{ o.description }}</span>
                </span>
                <SelectItemIndicator class="flex text-primary">
                  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                </SelectItemIndicator>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <button
      v-if="props.clearable && hasValue && !props.disabled"
      type="button"
      aria-label="Clear"
      class="well-button absolute end-9 top-1/2 size-9 -translate-y-1/2"
      @click="clear"
    >
      <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
  </div>
  </Field>
</template>