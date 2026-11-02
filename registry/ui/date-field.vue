<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import type { DateValue } from '@internationalized/date'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import { cn } from '@/lib/utils'
import Field from '@/components/ui/field.vue'

const props = defineProps<{
  label: string
  minValue?: DateValue
  maxValue?: DateValue
  error?: string
  hint?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<DateValue>()
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
    <DateFieldRoot
      :id="id"
      v-slot="{ segments }"
      v-model="model"
      :min-value="props.minValue"
      :max-value="props.maxValue"
      :disabled="props.disabled"
      :aria-invalid="invalid ? true : undefined"
      :aria-describedby="describedby"
      :class="
        cn(
          'well numeral flex h-control w-full items-center px-[calc(0.75rem-var(--stroke-edge))] text-ink',
          'focus-within:border-primary focus-within:[--_veil:transparent] focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
          'aria-invalid:focus-within:outline-danger',
          'data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent data-[disabled]:bg-transparent data-[disabled]:text-muted data-[disabled]:outline-1 data-[disabled]:-outline-offset-1 data-[disabled]:outline-edge-strong data-[disabled]:outline-dashed data-[disabled]:[box-shadow:none]',
        )
      "
    >
      <template v-for="s in segments" :key="s.part">
        <span v-if="s.part === 'literal'" class="px-px text-muted">{{ s.value }}</span>
        <DateFieldInput
          v-else
          :part="s.part"
          class="rounded-sm px-1 py-0.5 outline-none transition-state focus:bg-primary-soft focus:text-primary data-[placeholder]:text-muted data-[disabled]:cursor-not-allowed"
        >
          {{ s.value }}
        </DateFieldInput>
      </template>
    </DateFieldRoot>
  </Field>
</template>
