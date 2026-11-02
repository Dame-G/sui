<script setup lang="ts">
import { computed, type HTMLAttributes, type Slots } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import Tooltip from '@/components/ui/tooltip.vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
// With the tooltip off (a menu or dialog trigger) the button must stay the root element, so the wrapper renders its children and nothing else.
const Passthrough = (_: unknown, { slots }: { slots: Slots }) => slots.default?.()
const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** The accessible name. Required: an icon alone says nothing to a screen reader. It also shows as a tooltip. */
      label: string
      loading?: boolean
      /** Show the label as a tooltip. Turn it off when the button is the `as-child` trigger of a menu or dialog (a tooltip wrapper has no element of its own to hand back); the `title` attribute then carries the label. */
      tooltip?: boolean
      class?: HTMLAttributes['class']
    }
  >(),
  { as: 'button', tooltip: true },
)

const faceClass = computed(() =>
  cn(
    'slab type-button relative inline-grid size-tap shrink-0 cursor-pointer place-items-center bg-surface bg-clip-padding text-ink transition-state select-none',
    'hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring',
    'disabled:slab-flat disabled:dashed-edge disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-muted disabled:shadow-none',
    'aria-busy:slab-flat aria-busy:dashed-edge aria-busy:cursor-progress aria-busy:border-transparent aria-busy:bg-primary-soft aria-busy:text-primary aria-busy:shadow-none',
    props.class,
  ),
)

function onClick(e: MouseEvent) {
  if (!props.loading) return
  e.preventDefault()
  e.stopImmediatePropagation()
}
</script>

<template>
  <!-- A square outline face on a slab at the 44px tap size: the same press as Button, quieter, for toolbars and corners. -->
  <component :is="props.tooltip ? Tooltip : Passthrough" v-bind="props.tooltip ? { content: props.label } : {}">
    <Primitive
      :as="props.as"
      :as-child="props.asChild"
      :aria-label="props.label"
      :title="props.tooltip ? undefined : props.label"
      :aria-busy="props.loading ? true : undefined"
      :class="faceClass"
      v-bind="$attrs"
      @click.capture="onClick"
    >
      <svg v-if="props.loading" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" pathLength="36" stroke-dasharray="11 25" class="origin-center animate-ring motion-reduce:animate-none" />
      </svg>
      <span v-else class="grid size-5 place-items-center [&>svg]:size-5" aria-hidden="true"><slot /></span>
    </Primitive>
  </component>
</template>
