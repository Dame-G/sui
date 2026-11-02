<script setup lang="ts">
import { useId, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    legend: string
    hint?: string
    error?: string
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
    class?: HTMLAttributes['class']
  }>(),
  { orientation: 'vertical' },
)
const id = useId()
const describedby = () => [props.hint && `${id}-hint`, props.error && `${id}-error`].filter(Boolean).join(' ') || undefined
</script>

<template>
  <!-- No box: a legend, the controls, a hint and an error, so it sits inside a card or a page without another frame. -->
  <fieldset
    :disabled="props.disabled"
    :aria-describedby="describedby()"
    :aria-invalid="props.error ? true : undefined"
    :class="cn('group/fieldset m-0 min-w-0 border-0 p-0', props.class)"
  >
    <legend class="kicker mb-2 p-0 group-disabled/fieldset:text-muted">{{ props.legend }}</legend>
    <p v-if="props.hint" :id="`${id}-hint`" class="mb-2 text-sm/[1.4286] text-muted">{{ props.hint }}</p>
    <div :class="props.orientation === 'vertical' ? 'grid gap-1' : 'flex flex-wrap items-center gap-x-6 gap-y-1'"><slot /></div>
    <p v-if="props.error" :id="`${id}-error`" class="mt-2 flex items-start gap-1 text-sm/[1.4286] font-medium text-danger">
      <svg viewBox="0 0 256 256" class="mt-0.5 size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
      </svg>
      {{ props.error }}
    </p>
  </fieldset>
</template>
