<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ToolbarButton, ToolbarRoot, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from 'reka-ui'
import { cn } from '@/lib/utils'

export interface ToolbarItem {
  type: 'button' | 'toggle' | 'separator'
  value?: string
  label?: string
}

const props = defineProps<{ items: ToolbarItem[]; label?: string; class?: HTMLAttributes['class'] }>()
const pressed = defineModel<string[]>('pressed', { default: () => [] })
const emit = defineEmits<{ action: [value: string] }>()

// Consecutive toggles share one Reka group, so arrow keys and `pressed` work across them.
type Segment = { kind: 'toggles'; items: ToolbarItem[] } | { kind: 'button'; item: ToolbarItem } | { kind: 'separator' }
const segments = computed(() => {
  const out: Segment[] = []
  for (const item of props.items) {
    const last = out[out.length - 1]
    if (item.type === 'separator') out.push({ kind: 'separator' })
    else if (item.type === 'button') out.push({ kind: 'button', item })
    else if (last?.kind === 'toggles') last.items.push(item)
    else out.push({ kind: 'toggles', items: [item] })
  }
  return out
})

function groupValue(items: ToolbarItem[]) {
  return pressed.value.filter((v) => items.some((i) => i.value === v))
}
function setGroup(items: ToolbarItem[], next: unknown) {
  const mine = new Set(items.map((i) => i.value))
  pressed.value = [...pressed.value.filter((v) => !mine.has(v)), ...((next as string[]) ?? [])]
}

// The quiet button look shared with the menubar triggers; a pressed toggle takes the primary tone.
const face = [
  'inline-flex h-tap min-w-tap cursor-pointer items-center justify-center gap-2 rounded-[max(0px,calc(var(--radius-md)-2px))] border border-transparent px-2 font-medium text-ink transition-state select-none',
  'hover:bg-wash-hover hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press active:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-ink)] focus-ring',
  'data-[state=on]:border-primary data-[state=on]:bg-primary-soft data-[state=on]:text-primary data-[state=on]:shadow-none',
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-muted data-[disabled]:hover:bg-transparent data-[disabled]:hover:shadow-none',
].join(' ')
</script>

<template>
  <ToolbarRoot :aria-label="props.label ?? 'Toolbar'" :class="cn('flex w-fit max-w-full items-center gap-1 rounded-md bg-surface p-1 shadow-frame', props.class)">
    <template v-for="(seg, i) in segments" :key="i">
      <ToolbarSeparator v-if="seg.kind === 'separator'" class="mx-1 h-6 w-px shrink-0 bg-edge" />
      <ToolbarButton v-else-if="seg.kind === 'button'" :class="face" :aria-label="seg.item.label" @click="emit('action', seg.item.value ?? '')">
        <slot :name="seg.item.value ?? ''">{{ seg.item.label }}</slot>
      </ToolbarButton>
      <ToolbarToggleGroup
        v-else
        type="multiple"
        class="flex items-center gap-1"
        :model-value="groupValue(seg.items)"
        @update:model-value="(v) => setGroup(seg.items, v)"
      >
        <ToolbarToggleItem v-for="t in seg.items" :key="t.value" :value="t.value ?? ''" :aria-label="t.label" :class="face">
          <slot :name="t.value ?? ''">{{ t.label }}</slot>
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    </template>
  </ToolbarRoot>
</template>
