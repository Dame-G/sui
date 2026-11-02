<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { getLocalTimeZone, type DateValue } from '@internationalized/date'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'
import Field from '@/components/ui/field.vue'
import Calendar from '@/components/ui/calendar.vue'

const props = defineProps<{
  label: string
  placeholder?: string
  minValue?: DateValue
  maxValue?: DateValue
  disabledDate?: (date: DateValue) => boolean
  marked?: DateValue[]
  footer?: boolean
  error?: string
  hint?: string
  required?: boolean
  optional?: boolean
  /** Submits the date as YYYY-MM-DD with a form. */
  name?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<DateValue>()
const open = ref(false)
const format = (d: DateValue) => d.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { dateStyle: 'medium' })
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
    <input v-if="props.name" type="hidden" :name="props.name" :value="model?.toString() ?? ''" />
    <PopoverRoot v-model:open="open">
      <PopoverTrigger
        :id="id"
        type="button"
        :disabled="props.disabled"
        :aria-invalid="invalid ? true : undefined"
        :aria-describedby="describedby"
        class="well well-trigger"
      >
        <span :class="cn('min-w-0 truncate', !model && 'text-muted')">{{ model ? format(model) : (props.placeholder ?? 'Pick a date') }}</span>
        <svg class="size-5 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="start"
          :side-offset="4"
          :collision-padding="8"
          class="panel w-fit max-w-[calc(100vw-1rem)] p-3 focus-inset"
        >
          <Calendar v-model="model" :min-value="props.minValue" :max-value="props.maxValue" :disabled-date="props.disabledDate" :marked="props.marked" :footer="props.footer" @update:model-value="open = false" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </Field>
</template>
