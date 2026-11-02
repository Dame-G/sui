<script setup lang="ts">
import { watch, type HTMLAttributes } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    /** `count` shows a small number after the label (unread, open items...). */
    tabs: { value: string; label: string; count?: number; disabled?: boolean }[]
    orientation?: 'horizontal' | 'vertical'
    class?: HTMLAttributes['class']
  }>(),
  { orientation: 'horizontal' },
)
const model = defineModel<string>()

// When the number on the tab you are looking at changes, say so.
watch(
  () => props.tabs.find((t) => t.value === model.value)?.count,
  (n, was) => n !== undefined && was !== undefined && n !== was && announce(`${n} items`),
)
</script>

<template>
  <TabsRoot
    v-model="model"
    :default-value="props.tabs.find((t) => !t.disabled)?.value"
    :orientation="props.orientation"
    :class="cn('flex gap-4', props.orientation === 'vertical' ? 'flex-row items-start' : 'flex-col', props.class)"
  >
    <!-- A bordered strip: neighbours sit flush and share an edge, only the ends are rounded. -->
    <TabsList :class="cn('isolate flex', props.orientation === 'vertical' ? 'w-fit shrink-0 flex-col' : 'w-fit')">
      <TabsTrigger
        v-for="t in props.tabs"
        :key="t.value"
        :value="t.value"
        :disabled="t.disabled"
        :class="
          cn(
            'type-button relative z-0 inline-flex h-control flex-none cursor-pointer items-center gap-2 border border-edge-strong bg-transparent bg-clip-padding px-[calc(1rem-var(--stroke-edge))] text-muted transition-state',
            props.orientation === 'vertical'
              ? '-mt-px justify-between first:mt-0 first:rounded-t-md last:rounded-b-md'
              : '-ms-px first:ms-0 first:rounded-s-md last:rounded-e-md',
            // hover: ink text, the wash and a darker edge of the same width, no ring
            'hover:z-10 hover:border-wash-ring hover:bg-wash-hover hover:text-ink active:border-ink active:bg-wash-press',
            // selected = where you are: pastel tint, primary edges thickened, primary slab below
            'data-[state=active]:z-20 data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:border-b-primary-slab data-[state=active]:bg-primary-soft data-[state=active]:px-[calc(1rem-2px)] data-[state=active]:text-primary',
            'data-[disabled]:cursor-not-allowed data-[disabled]:border-dashed data-[disabled]:text-muted data-[disabled]:hover:z-0 data-[disabled]:hover:border-edge-strong data-[disabled]:hover:bg-transparent',
            'focus-ring focus-visible:z-30',
          )
        "
      >
        {{ t.label }}
        <span
          v-if="t.count !== undefined"
          class="numeral inline-grid h-chip min-w-6 place-items-center rounded-sm bg-surface-tint px-1.5 text-xs text-ink in-data-[state=active]:bg-surface"
          :aria-label="`${t.count} items`"
        >{{ t.count }}</span>
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="t in props.tabs" :key="t.value" :value="t.value" class="min-w-0 flex-1 rounded-sm focus-ring">
      <slot :name="t.value" />
    </TabsContent>
  </TabsRoot>
</template>
