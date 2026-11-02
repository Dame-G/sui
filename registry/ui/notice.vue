<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
    title: string
    class?: HTMLAttributes['class']
  }>(),
  { tone: 'info' },
)

// Full class names so Tailwind can see them.
const tones = {
  neutral: 'tone-neutral',
  info: 'tone-info',
  success: 'tone-success',
  warning: 'tone-warning',
  danger: 'tone-danger',
}
const role = computed(() => (props.tone === 'danger' ? 'alert' : 'status'))
</script>

<template>
  <div
    :role="role"
    :class="
      cn(
        'edge-start grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-[calc(0.75rem-var(--stroke-edge))] pr-[calc(1rem-var(--stroke-edge))] pl-[max(calc(1rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] text-ink',
        tones[props.tone],
        props.class,
      )
    "
  >
    <svg
      viewBox="0 0 24 24"
      class="size-6 text-(--_tone)"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <template v-if="props.tone === 'success'">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.8 2.8L16.2 9.6" />
      </template>
      <template v-else-if="props.tone === 'warning'">
        <path d="M12 4.2l9 15.6H3z" />
        <path d="M12 10v4" />
        <path d="M12 17.2h.01" />
      </template>
      <template v-else-if="props.tone === 'danger'">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
      </template>
      <template v-else>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 7.9h.01" />
      </template>
    </svg>
    <div class="grid min-w-0 gap-0.5">
      <p class="font-medium leading-snug">{{ props.title }}</p>
      <div v-if="$slots.default" class="text-sm leading-snug"><slot /></div>
    </div>
  </div>
</template>
