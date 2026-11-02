<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ title: string; class?: HTMLAttributes['class'] }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <!-- A framed section; the header is a quiet row that answers the pointer, the chevron turns over when open. -->
  <CollapsibleRoot v-model:open="open" :class="cn('overflow-hidden rounded-md bg-surface shadow-frame', props.class)">
    <CollapsibleTrigger
      class="group flex min-h-control w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-start font-medium leading-snug text-ink transition-state hover:bg-wash-hover active:bg-wash-press focus-inset"
    >
      {{ props.title }}
      <svg
        viewBox="0 0 16 16"
        class="size-5 shrink-0 transition-transform duration-(--duration-tap) ease-(--ease-out) group-data-[state=open]:rotate-180"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6l5 5 5-5" />
      </svg>
    </CollapsibleTrigger>
    <CollapsibleContent
      class="overflow-hidden data-[state=closed]:animate-[sui-collapse-up_var(--duration-move)_var(--ease-out)] data-[state=open]:animate-[sui-collapse-down_var(--duration-move)_var(--ease-out)]"
    >
      <div class="border-t border-edge px-4 py-3 leading-normal text-muted"><slot /></div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
