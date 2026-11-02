<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/badge.vue'

export interface DescriptionItem {
  /** Leave it out on every row for a plain list of facts. */
  label?: string
  text: string
  /** A short word in a badge after the text, such as "Verified". */
  badge?: string
  badgeTone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  /** A quiet action at the row's end, such as "Edit". It fires the `action` event; use the `action` slot instead for anything richer. */
  action?: string
}

const props = defineProps<{
  items: (DescriptionItem | null | undefined)[]
  /** Message when there are no rows. */
  empty?: string
  loading?: boolean
  /** `dl` for label and value pairs, `ul` for plain facts. Defaults to `ul` when no row has a label. */
  as?: 'dl' | 'ul'
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{ action: [item: DescriptionItem, index: number] }>()
defineSlots<{
  /** Replaces a row's text, for rich content. */
  text?(props: { item: DescriptionItem; index: number }): unknown
  /** Content after a row's text and badge, such as an Edit button. */
  action?(props: { item: DescriptionItem; index: number }): unknown
}>()

const shown = computed(() => props.items.filter((it): it is DescriptionItem => Boolean(it)))
const plain = computed(() => (props.as ? props.as === 'ul' : shown.value.length > 0 && shown.value.every((it) => !it.label)))
// Rows are ruled apart: a hairline above every row but the first.
const row = 'border-t border-edge py-3 first:border-t-0'
</script>

<template>
  <div v-if="props.loading" :class="cn('grid gap-3 py-3', props.class)" role="status" aria-busy="true">
    <span v-for="i in 3" :key="i" aria-hidden="true" class="block h-4 animate-pulse-soft rounded-sm bg-surface-tint" :class="i === 2 ? 'w-1/2' : 'w-3/4'" />
    <span class="sr-only">Loading…</span>
  </div>
  <p v-else-if="!shown.length" :class="cn('py-10 text-center text-muted', props.class)">{{ props.empty ?? 'Nothing to show.' }}</p>
  <ul v-else-if="plain" :class="cn('m-0 grid list-none p-0', props.class)">
    <li v-for="(item, i) in shown" :key="i" :class="cn(row, 'flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1')">
      <span class="min-w-0 flex-[1_1_9rem] [overflow-wrap:anywhere]"><slot name="text" :item="item" :index="i">{{ item.text }}</slot></span>
      <Badge v-if="item.badge" :tone="item.badgeTone">{{ item.badge }}</Badge>
      <slot name="action" :item="item" :index="i">
        <button
          v-if="item.action"
          type="button"
          :aria-label="`${item.action} ${item.label ?? item.text}`"
          class="type-button cursor-pointer rounded-sm px-1 text-primary underline underline-offset-4 transition-state hover:text-primary-hover focus-ring"
          @click="emit('action', item, i)"
        >
          {{ item.action }}
        </button>
      </slot>
    </li>
  </ul>
  <!-- Wide containers put the label beside the value; narrow ones stack them. -->
  <dl v-else :class="cn('@container m-0 grid', props.class)">
    <div v-for="(item, i) in shown" :key="item.label ?? i" :class="cn(row, 'grid min-w-0 gap-1 @md:grid-cols-[11rem_minmax(0,1fr)] @md:items-baseline @md:gap-6')">
      <dt class="kicker">{{ item.label }}</dt>
      <dd class="m-0 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span class="min-w-0 flex-[1_1_9rem] [overflow-wrap:anywhere]"><slot name="text" :item="item" :index="i">{{ item.text }}</slot></span>
        <Badge v-if="item.badge" :tone="item.badgeTone">{{ item.badge }}</Badge>
        <slot name="action" :item="item" :index="i">
          <button
            v-if="item.action"
            type="button"
            :aria-label="`${item.action} ${item.label ?? item.text}`"
            class="type-button cursor-pointer rounded-sm px-1 text-primary underline underline-offset-4 transition-state hover:text-primary-hover focus-ring"
            @click="emit('action', item, i)"
          >
            {{ item.action }}
          </button>
        </slot>
      </dd>
    </div>
  </dl>
</template>
