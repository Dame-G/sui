<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ items: { label: string; href?: string }[]; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" :class="props.class">
    <ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-sm">
      <li v-for="(item, i) in props.items" :key="item.label" class="inline-flex items-center gap-2 text-muted">
        <a
          v-if="item.href && i < props.items.length - 1"
          :href="item.href"
          :class="
            cn(
              // a link: action colour, underlined; the wash answers the pointer
              `relative inline-flex items-center rounded-sm text-primary underline after:absolute after:-inset-y-3 after:inset-x-0 after:content-[''] decoration-primary underline-offset-[0.25em] transition-state`,
              'hover:bg-wash-hover hover:text-ink hover:decoration-ink active:bg-wash-press focus-ring',
            )
          "
        >
          {{ item.label }}
        </a>
        <span v-else aria-current="page" class="inline-flex items-center rounded-sm font-medium text-ink">
          {{ item.label }}
        </span>
        <svg
          v-if="i < props.items.length - 1"
          viewBox="0 0 16 16"
          class="size-3.5 shrink-0 rtl:-scale-x-100"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </li>
    </ol>
  </nav>
</template>
