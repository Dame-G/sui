<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { getLocalTimeZone, type DateValue } from '@internationalized/date'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, type DateRange } from 'reka-ui'
import { cn } from '@/lib/utils'
import Field from '@/components/ui/field.vue'
import RangeCalendar from '@/components/ui/range-calendar.vue'

const props = defineProps<{
  label: string
  placeholder?: string
  minValue?: DateValue
  maxValue?: DateValue
  disabledDate?: (date: DateValue) => boolean
  marked?: DateValue[]
  presets?: { label: string; value: { start: DateValue; end: DateValue } }[]
  footer?: boolean
  error?: string
  hint?: string
  required?: boolean
  optional?: boolean
  /** Submit the two ends as YYYY-MM-DD with a form. */
  startName?: string
  endName?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<DateRange>({ default: () => ({ start: undefined, end: undefined }) })
const open = ref(false)

const tz = getLocalTimeZone()
const fmt = (d: DateValue, o: Intl.DateTimeFormatOptions) => d.toDate(tz).toLocaleDateString(undefined, o)
// "Nov 3 – Nov 9, 2026", or both years when they differ.
function text(r: DateRange) {
  if (!r.start) return ''
  if (!r.end) return `${fmt(r.start, { dateStyle: 'medium' })} – …`
  return r.start.year === r.end.year
    ? `${fmt(r.start, { month: 'short', day: 'numeric' })} – ${fmt(r.end, { dateStyle: 'medium' })}`
    : `${fmt(r.start, { dateStyle: 'medium' })} – ${fmt(r.end, { dateStyle: 'medium' })}`
}
// Close once both ends are chosen.
function onPick(r: DateRange) {
  if (r.start && r.end) open.value = false
}
</script>

<template>
  <Field
    v-slot="{ id, describedby, invalid }"
    :label="props.label"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :optional="props.optional"
    :disabled="props.disabled"
    :class="props.class"
  >
    <input v-if="props.startName" type="hidden" :name="props.startName" :value="model.start?.toString() ?? ''" />
    <input v-if="props.endName" type="hidden" :name="props.endName" :value="model.end?.toString() ?? ''" />
    <PopoverRoot v-model:open="open">
      <PopoverTrigger
        :id="id"
        type="button"
        :disabled="props.disabled"
        :aria-invalid="invalid ? true : undefined"
        :aria-describedby="describedby"
        class="well well-trigger"
      >
        <span :class="cn('min-w-0 truncate', !model.start && 'text-muted')">{{ model.start ? text(model) : (props.placeholder ?? 'Pick a date range') }}</span>
        <svg class="size-5 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="start"
          :side-offset="4"
          :collision-padding="8"
          class="panel w-fit max-w-[calc(100vw-1rem)] p-3 focus-inset"
        >
          <RangeCalendar v-model="model" :min-value="props.minValue" :max-value="props.maxValue" :disabled-date="props.disabledDate" :marked="props.marked" :presets="props.presets" :footer="props.footer" @update:model-value="onPick" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </Field>
</template>
