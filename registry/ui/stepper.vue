<script setup lang="ts">
import { computed, watch, type HTMLAttributes } from 'vue'
import { StepperDescription, StepperIndicator, StepperItem, StepperRoot, StepperSeparator, StepperTitle, StepperTrigger } from 'reka-ui'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    steps: { value: number; title: string; description?: string; error?: boolean }[]
    /** Steps are buttons you can jump to. Off: they only show where you are, and your own Next/Back move on. */
    interactive?: boolean
    orientation?: 'horizontal' | 'vertical'
    class?: HTMLAttributes['class']
  }>(),
  { interactive: true, orientation: 'horizontal' },
)
// The current step, counted from 1.
const model = defineModel<number>({ default: 1 })

const last = computed(() => props.steps[props.steps.length - 1]?.value)
const vertical = computed(() => props.orientation === 'vertical')

watch(model, (v) => {
  const s = props.steps.find((x) => x.value === v)
  if (s) announce(`Step ${v} of ${props.steps.length}: ${s.title}`)
})

// The state in words, so it is never colour or shape alone.
function name(s: { value: number; title: string; error?: boolean }, state: string) {
  const status = s.error ? 'has an error' : state === 'completed' ? 'done' : state === 'active' ? 'current step' : 'to do'
  return `Step ${s.value} of ${props.steps.length}: ${s.title}, ${status}`
}
</script>

<template>
  <StepperRoot
    v-model="model"
    :orientation="props.orientation"
    :class="cn('flex w-full', vertical ? 'flex-col items-start gap-1' : 'items-start gap-3', props.class)"
  >
    <StepperItem
      v-for="s in props.steps"
      :key="s.value"
      v-slot="{ state }"
      :step="s.value"
      :class="cn('group flex min-w-0 gap-2', vertical ? 'w-full flex-col items-stretch' : 'flex-1 items-center last:flex-none')"
    >
      <div :class="cn('flex min-w-0 items-center gap-2', vertical && 'flex-col items-start')">
        <component
          :is="props.interactive ? StepperTrigger : 'div'"
          :aria-label="props.interactive ? name(s, state) : undefined"
          :aria-current="!props.interactive && state === 'active' ? 'step' : undefined"
          :class="
            cn(
              'flex flex-none items-center gap-3 rounded-md p-1 text-start transition-state',
              props.interactive &&
                'cursor-pointer hover:bg-wash-hover active:bg-wash-press focus-ring data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent',
            )
          "
        >
          <!-- The badge: done = primary face on its slab, current = primary edge and soft fill, error = danger edge and a mark, to do = a quiet edge. -->
          <component
            :is="StepperIndicator"
            :class="
              cn(
                'numeral inline-grid size-10 shrink-0 place-items-center rounded-md border border-edge-strong bg-surface text-muted transition-state',
                s.error
                  ? 'border-2 border-danger bg-danger-soft text-danger'
                  : [
                      'group-data-[state=active]:border-2 group-data-[state=active]:border-primary group-data-[state=active]:bg-primary-soft group-data-[state=active]:text-primary',
                      'group-data-[state=completed]:slab group-data-[state=completed]:slab-thin group-data-[state=completed]:slab-primary group-data-[state=completed]:bg-primary group-data-[state=completed]:text-on-primary',
                    ],
            )
            "
          >
            <svg v-if="s.error" viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M8 3.5v5M8 12h.01" />
            </svg>
            <svg
              v-else-if="state === 'completed'"
              viewBox="0 0 16 16"
              class="size-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 8.5l3 3 6-6.5" />
            </svg>
            <template v-else>{{ s.value }}</template>
          </component>
          <span class="grid min-w-0 gap-0.5">
            <StepperTitle as="span" :class="cn('font-medium leading-snug text-muted', state !== 'inactive' && 'text-ink', s.error && 'text-danger')">{{ s.title }}</StepperTitle>
            <StepperDescription v-if="s.description" class="text-sm leading-snug text-muted">{{ s.description }}</StepperDescription>
            <span v-if="!props.interactive" class="sr-only">{{ s.error ? 'has an error' : state === 'completed' ? 'done' : state === 'active' ? 'current step' : 'to do' }}</span>
          </span>
        </component>
      </div>
      <!-- The connector between steps: a hairline, thickened and primary once that step is done. -->
      <StepperSeparator
        v-if="s.value !== last"
        :class="
          cn(
            'rounded-full bg-edge-strong transition-state data-[state=completed]:bg-primary',
            vertical ? 'ms-[calc(0.25rem+1.25rem-1px)] h-4 w-px data-[state=completed]:w-0.5' : 'h-px min-w-4 flex-1 data-[state=completed]:h-0.5',
          )
        "
      />
    </StepperItem>
  </StepperRoot>
</template>
