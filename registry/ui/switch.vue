<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { Label, SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  /** A line of help under the label, read after the label rather than as part of its name. */
  description?: string
  hideLabel?: boolean
  disabled?: boolean
  value?: string
  name?: string
  required?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<boolean>({ default: false })
const id = useId()
</script>

<template>
  <div :class="cn('group flex min-h-tap gap-3 py-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted', props.description && !props.hideLabel ? 'items-start' : 'items-center', props.class)">
    <SwitchRoot
      :id="id"
      v-model="model"
      :disabled="props.disabled"
      :value="props.value"
      :name="props.name"
      :required="props.required"
      :aria-describedby="props.description ? `${id}-description` : undefined"
      :class="
        cn(
          // off: a pressed-in track. on: the primary face on a thin slab. the thumb is a small button face either way.
          'slab slab-sm relative flex h-check w-11 shrink-0 cursor-pointer items-center bg-surface-tint bg-clip-padding transition-state [--_lift:0px] [box-shadow:var(--shadow-well)] focus-ring',
          'group-hover:data-[state=unchecked]:bg-wash-hover group-hover:data-[state=unchecked]:[--_ring:var(--color-wash-ring)]',
          'group-active:data-[state=unchecked]:bg-wash-press group-active:data-[state=unchecked]:[--_ring:var(--color-ink)]',
          'data-[state=checked]:slab-primary data-[state=checked]:bg-primary data-[state=checked]:bg-clip-border data-[state=checked]:pt-px data-[state=checked]:[--_lift:var(--depth-thin)] data-[state=checked]:[box-shadow:none]',
          'group-hover:data-[state=checked]:bg-primary-hover group-active:data-[state=checked]:bg-primary-press group-active:data-[state=checked]:[--_lift:0px] group-active:data-[state=checked]:pt-0',
          'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:data-[state=checked]:bg-transparent disabled:data-[state=checked]:pt-0 disabled:dashed-edge disabled:[--_lift:0px] disabled:[box-shadow:none]',
        )
      "
    >
      <SwitchThumb
        class="ms-[calc(var(--spacing)*1-var(--stroke-edge))] block size-4 rounded-[max(0px,calc(var(--radius-sm)-0.25rem))] border border-b-[calc(var(--stroke-edge)+var(--depth-thin))] border-edge-strong bg-surface transition-[transform,border-color] duration-(--duration-move) ease-(--ease-out) data-[state=checked]:translate-x-5 data-[state=checked]:border-ink group-active:border-b-(length:--stroke-edge) group-has-[:disabled]:border-muted"
      />
    </SwitchRoot>
    <div :class="props.hideLabel ? 'sr-only' : 'grid min-w-0 gap-0.5'">
      <Label :for="id" class="min-w-0 cursor-[inherit] leading-normal">{{ props.label }}</Label>
      <p v-if="props.description" :id="`${id}-description`" class="text-sm/[1.4286] text-muted">{{ props.description }}</p>
    </div>
  </div>
</template>
