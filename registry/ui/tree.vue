<script lang="ts">
export interface TreeNode {
  value: string
  label: string
  children?: TreeNode[]
}
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { TreeItem, TreeRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    items: TreeNode[]
    defaultExpanded?: string[]
    /** What opens a folder: a click anywhere on its row, or only its chevron (then the row just selects). Arrow keys always work. */
    toggleOn?: 'row' | 'chevron'
    class?: HTMLAttributes['class']
  }>(),
  { toggleOn: 'row' },
)
const model = defineModel<string>()

function find(nodes: TreeNode[], value?: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.value === value) return n
    const hit = n.children && find(n.children, value)
    if (hit) return hit
  }
}
const selected = computed(() => find(props.items, model.value))

function fromChevron(e: CustomEvent<{ originalEvent: Event }>) {
  return !!(e.detail.originalEvent.target as HTMLElement | null)?.closest?.('[data-chevron]')
}
function onToggle(e: CustomEvent<{ originalEvent: Event }>) {
  if (props.toggleOn === 'chevron' && !(e.detail.originalEvent instanceof KeyboardEvent) && !fromChevron(e)) e.preventDefault()
}
function onSelect(e: CustomEvent<{ originalEvent: Event }>) {
  if (props.toggleOn === 'chevron' && fromChevron(e)) e.preventDefault()
}
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="props.items"
    :get-key="(n: TreeNode) => n.value"
    :get-children="(n: TreeNode) => n.children"
    :model-value="selected"
    :default-expanded="props.defaultExpanded"
    :class="cn('m-0 w-full min-w-48 list-none bg-surface p-2', props.class)"
    @update:model-value="(n: TreeNode | undefined) => n && (model = n.value)"
  >
    <!-- Each level before the row's own is a narrow column holding a hairline guide; the row's own column holds the chevron. -->
    <TreeItem v-for="item in flattenItems" :key="item._id" v-slot="{ isExpanded, isSelected, handleToggle }" v-bind="item.bind" as-child @toggle="onToggle" @select="onSelect">
      <!-- Reka toggles a folder on click and with the arrow keys; Enter is added here so the keyboard has the same single-key toggle. -->
      <li
        @keydown.enter="item.hasChildren && props.toggleOn === 'row' && handleToggle()"
        :aria-level="item.level"
        :class="
          cn(
            'flex h-tap w-full cursor-pointer list-none items-center gap-1 rounded-md pe-3 ps-2 text-start leading-tight text-ink transition-state select-none',
            'hover:bg-wash-hover hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press active:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-ink)] focus-inset',
            isSelected
              ? 'edge-start ps-[calc(0.5rem-var(--depth-bold))] [--_tone:var(--color-primary)] [--_bg:var(--color-primary-soft)] font-medium text-primary hover:shadow-none active:shadow-none'
              : 'border border-transparent',
          )
        "
      >
      <span
        v-for="n in item.level - 1"
        :key="n"
        aria-hidden="true"
        class="relative h-tap w-5 shrink-0 self-stretch before:absolute before:inset-y-0 before:left-1/2 before:border-s before:border-edge"
      />
      <span data-chevron class="inline-grid size-5 shrink-0 place-items-center text-muted">
        <svg
          v-if="item.hasChildren"
          viewBox="0 0 16 16"
          class="size-4 transition-transform duration-(--duration-tap) ease-(--ease-out) rtl:-scale-x-100"
          :class="isExpanded && 'rotate-90 rtl:-scale-x-100'"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </span>
      <svg
        viewBox="0 0 16 16"
        class="size-4 shrink-0"
        :class="isSelected ? 'text-primary' : 'text-muted'"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <template v-if="item.hasChildren">
          <path d="M1.75 4.25a1 1 0 0 1 1-1h3.1l1.4 1.5h5a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1z" />
        </template>
        <template v-else>
          <path d="M3.75 1.75h5.5l3 3v8.5a1 1 0 0 1-1 1h-7.5a1 1 0 0 1-1-1v-10.5a1 1 0 0 1 1-1z" />
          <path d="M9 1.75v3h3" />
        </template>
      </svg>
      <span class="min-w-0 truncate">{{ item.value.label }}</span>
      </li>
    </TreeItem>
  </TreeRoot>
</template>
