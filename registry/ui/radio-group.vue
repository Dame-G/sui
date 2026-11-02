<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { Label, RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  options: { value: string; label: string; /** A line of help under the label. */ description?: string; disabled?: boolean }[]
  /** Hide every option's label visually (they stay for screen readers); useful for a table of radios. */
  hideLabel?: boolean
  name?: string
  required?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>()
const id = useId()
</script>

<template>
  <RadioGroupRoot v-model="model" :name="props.name" :required="props.required" :disabled="props.disabled" :class="cn('grid', props.class)">
    <div
      v-for="o in props.options"
      :key="o.value"
      class="group flex min-h-tap items-start gap-3 py-2.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted"
    >
      <RadioGroupItem
        :id="`${id}-${o.value}`"
        :value="o.value"
        :disabled="o.disabled"
        :aria-describedby="o.description ? `${id}-${o.value}-description` : undefined"
        :class="
          cn(
            // unchecked: a bordered round item. checked: a coin, the primary face with its slab as one crescent under it.
            'relative flex size-check shrink-0 cursor-pointer items-center justify-center rounded-full border border-edge-strong bg-surface bg-clip-padding transition-state focus-ring',
            'group-hover:data-[state=unchecked]:border-(--color-wash-ring) group-hover:data-[state=unchecked]:bg-wash-hover',
            'group-active:data-[state=unchecked]:border-ink group-active:data-[state=unchecked]:bg-wash-press',
            'data-[state=checked]:border-0 data-[state=checked]:bg-primary data-[state=checked]:bg-clip-border data-[state=checked]:[box-shadow:inset_0_calc(-1*(var(--stroke-edge)+var(--depth-thin)))_0_var(--color-primary-slab)]',
            'group-hover:data-[state=checked]:bg-primary-hover group-active:data-[state=checked]:bg-primary-press group-active:data-[state=checked]:[box-shadow:inset_0_calc(-1*var(--stroke-edge))_0_var(--color-primary-slab)]',
            'disabled:cursor-not-allowed disabled:data-[state=unchecked]:border-transparent disabled:data-[state=unchecked]:bg-transparent disabled:data-[state=unchecked]:dashed-edge disabled:data-[state=checked]:border disabled:data-[state=checked]:border-edge-strong disabled:data-[state=checked]:bg-transparent disabled:data-[state=checked]:[box-shadow:none]',
          )
        "
      >
        <RadioGroupIndicator class="block size-2 -translate-y-px rounded-full bg-on-primary group-has-[:disabled]:translate-y-0 group-has-[:disabled]:bg-muted" />
      </RadioGroupItem>
      <div :class="props.hideLabel ? 'sr-only' : 'grid min-w-0 gap-0.5'">
        <Label :for="`${id}-${o.value}`" class="min-w-0 cursor-[inherit] leading-normal">{{ o.label }}</Label>
        <p v-if="o.description" :id="`${id}-${o.value}-description`" class="text-sm/[1.4286] text-muted">{{ o.description }}</p>
      </div>
    </div>
  </RadioGroupRoot>
</template>
