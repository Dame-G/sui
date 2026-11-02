<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot, Label } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  /** A line of help under the label, read after the label rather than as part of its name. */
  description?: string
  hideLabel?: boolean
  disabled?: boolean
  /** Sent with the form when checked (default "on"), and the field name. */
  value?: string
  name?: string
  required?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<boolean | 'indeterminate'>({ default: false })
const id = useId()
</script>

<template>
  <div :class="cn('group flex min-h-tap items-start gap-3 py-2.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted', props.class)">
    <CheckboxRoot
      :id="id"
      v-model="model"
      :disabled="props.disabled"
      :value="props.value"
      :name="props.name"
      :required="props.required"
      :aria-describedby="props.description ? `${id}-description` : undefined"
      :class="
        cn(
          // unchecked: a bordered item. checked: a small button face, primary on a thin slab
          'slab slab-sm relative flex size-check shrink-0 cursor-pointer items-center justify-center bg-surface bg-clip-padding transition-state [--_lift:0px] focus-ring',
          'group-hover:data-[state=unchecked]:bg-wash-hover group-hover:data-[state=unchecked]:[--_ring:var(--color-wash-ring)]',
          'group-active:data-[state=unchecked]:bg-wash-press group-active:data-[state=unchecked]:[--_ring:var(--color-ink)]',
          'data-[state=checked]:slab-primary data-[state=checked]:bg-primary data-[state=checked]:bg-clip-border data-[state=checked]:[--_lift:var(--depth-thin)] data-[state=indeterminate]:slab-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:bg-clip-border data-[state=indeterminate]:[--_lift:var(--depth-thin)]',
          'group-hover:data-[state=checked]:bg-primary-hover group-hover:data-[state=indeterminate]:bg-primary-hover',
          'group-active:data-[state=checked]:bg-primary-press group-active:data-[state=checked]:[--_lift:0px] group-active:data-[state=indeterminate]:bg-primary-press group-active:data-[state=indeterminate]:[--_lift:0px]',
          'disabled:cursor-not-allowed disabled:bg-transparent disabled:data-[state=checked]:bg-transparent disabled:data-[state=indeterminate]:bg-transparent disabled:data-[state=unchecked]:border-transparent disabled:data-[state=unchecked]:dashed-edge disabled:data-[state=checked]:border-edge-strong disabled:data-[state=checked]:[--_lift:0px] disabled:data-[state=indeterminate]:border-edge-strong disabled:data-[state=indeterminate]:[--_lift:0px]',
        )
      "
    >
      <CheckboxIndicator class="flex text-on-primary group-has-[:disabled]:text-muted">
        <svg v-if="model === 'indeterminate'" viewBox="0 0 256 256" class="size-4" fill="currentColor" aria-hidden="true">
          <rect x="48" y="108" width="160" height="40" rx="20" />
        </svg>
        <svg v-else viewBox="0 0 256 256" class="size-4" fill="currentColor" aria-hidden="true">
          <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
        </svg>
      </CheckboxIndicator>
    </CheckboxRoot>
    <div :class="props.hideLabel ? 'sr-only' : 'grid min-w-0 gap-0.5'">
      <Label :for="id" class="min-w-0 cursor-[inherit] leading-normal">{{ props.label }}</Label>
      <p v-if="props.description" :id="`${id}-description`" class="text-sm/[1.4286] text-muted">{{ props.description }}</p>
    </div>
  </div>
</template>
