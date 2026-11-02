<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** Busy: a spinner sits over the label, the width does not change and clicks are ignored. */
      loading?: boolean
      /** Stretch to the full width of the parent. */
      block?: boolean
      class?: HTMLAttributes['class']
    }
  >(),
  { as: 'button' },
)

// A busy button keeps focus (it is not `disabled`) but swallows the click before any listener sees it.
function onClick(e: MouseEvent) {
  if (!props.loading) return
  e.preventDefault()
  e.stopImmediatePropagation()
}
</script>

<template>
  <!-- Icons are just children: <Button><PlusIcon /> New</Button>. Links are <Button as="a" href="...">. -->
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :aria-busy="props.loading ? true : undefined"
    :class="
      cn(
        // face on a primary slab
        'slab slab-primary type-button relative inline-flex h-control cursor-pointer items-center justify-center bg-primary px-[calc(1rem-var(--stroke-edge))] whitespace-nowrap text-on-primary no-underline transition-state select-none',
        // hover darkens; press sinks the face onto its slab
        'hover:bg-primary-hover active:slab-flat active:bg-primary-press focus-ring',
        // disabled: flat, no fill, dashed edge
        'disabled:slab-flat disabled:dashed-edge disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-muted',
        'aria-disabled:slab-flat aria-disabled:dashed-edge aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-transparent aria-disabled:text-muted',
        // busy is not disabled (that is dead; this is working): flat, a soft primary tint, dashed edge
        'aria-busy:slab-flat aria-busy:dashed-edge aria-busy:cursor-progress aria-busy:border-transparent aria-busy:bg-primary-soft aria-busy:text-primary aria-busy:hover:bg-primary-soft aria-busy:active:bg-primary-soft',
        props.block && 'flex w-full',
        props.class,
      )
    "
    @click.capture="onClick"
  >
    <svg v-if="props.loading" viewBox="0 0 24 24" class="absolute size-5" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" pathLength="36" stroke-dasharray="11 25" class="origin-center animate-ring motion-reduce:animate-none" />
    </svg>
    <span :class="cn('inline-flex items-center justify-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0', props.loading && 'invisible')"><slot /></span>
    <span v-if="props.loading" class="sr-only" role="status">Loading</span>
  </Primitive>
</template>
