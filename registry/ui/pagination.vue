<script setup lang="ts">
import { computed, watch, type HTMLAttributes } from 'vue'
import { PaginationEllipsis, PaginationList, PaginationListItem, PaginationRoot } from 'reka-ui'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    total: number
    itemsPerPage?: number
    /** Makes every page a real link (for server-rendered or router-driven pages). The model still updates on click. */
    href?: (page: number) => string
    class?: HTMLAttributes['class']
  }>(),
  { itemsPerPage: 10 },
)
const page = defineModel<number>('page', { default: 1 })
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.itemsPerPage)))
watch(page, (p) => announce(`Page ${p} of ${pages.value}`))

// Prev and next stay focusable at the ends (aria-disabled, not disabled), so focus is not dropped when you reach the last page.
const atStart = computed(() => page.value <= 1)
const atEnd = computed(() => page.value >= pages.value)
const go = (to: number, blocked: boolean, e?: Event) => {
  if (blocked) return e?.preventDefault()
  page.value = to
}

// An unbordered item takes the wash plus a ring that darkens on press; the current page is a primary face on its slab.
const item = [
  'numeral slab slab-flat inline-grid h-control min-w-control cursor-pointer place-items-center border-transparent bg-transparent px-[calc(0.5rem-var(--stroke-edge))] text-sm leading-none text-ink no-underline transition-state',
  'hover:bg-wash-hover enabled:hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)]',
  'active:bg-wash-press enabled:active:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-ink)]',
  'focus-ring',
  'aria-disabled:cursor-not-allowed aria-disabled:text-muted aria-disabled:hover:bg-transparent aria-disabled:hover:shadow-none aria-disabled:active:bg-transparent aria-disabled:active:shadow-none',
  'data-[selected]:slab-primary data-[selected]:cursor-default data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:[--_lift:var(--depth)] data-[selected]:shadow-none data-[selected]:hover:bg-primary',
].join(' ')
</script>

<template>
  <PaginationRoot v-model:page="page" :total="props.total" :items-per-page="props.itemsPerPage" :sibling-count="1" show-edges>
    <PaginationList v-slot="{ items }" :class="cn('flex items-center gap-1', props.class)">
      <component
        :is="props.href ? 'a' : 'button'"
        :type="props.href ? undefined : 'button'"
        :href="props.href && !atStart ? props.href(page - 1) : undefined"
        :aria-disabled="atStart || undefined"
        :class="item"
        aria-label="Previous page"
        @click="go(page - 1, atStart, $event)"
      >
        <svg viewBox="0 0 16 16" class="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 3L5 8l5 5" />
        </svg>
      </component>
      <template v-for="(entry, i) in items" :key="i">
        <PaginationListItem
          v-if="entry.type === 'page'"
          :value="entry.value"
          :as="props.href ? 'a' : 'button'"
          :href="props.href ? props.href(entry.value) : undefined"
          :aria-current="entry.value === page ? 'page' : undefined"
          :class="item"
        >
          {{ entry.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else :index="i" class="inline-grid h-control min-w-7 place-items-center text-muted">…</PaginationEllipsis>
      </template>
      <component
        :is="props.href ? 'a' : 'button'"
        :type="props.href ? undefined : 'button'"
        :href="props.href && !atEnd ? props.href(page + 1) : undefined"
        :aria-disabled="atEnd || undefined"
        :class="item"
        aria-label="Next page"
        @click="go(page + 1, atEnd, $event)"
      >
        <svg viewBox="0 0 16 16" class="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 3l5 5-5 5" />
        </svg>
      </component>
    </PaginationList>
  </PaginationRoot>
</template>
