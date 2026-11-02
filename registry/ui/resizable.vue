<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{ direction?: 'horizontal' | 'vertical'; sizes?: [number, number]; minSize?: number; class?: HTMLAttributes['class'] }>(),
  { direction: 'horizontal', sizes: () => [50, 50], minSize: 15 },
)
const emit = defineEmits<{ resize: [sizes: number[]] }>()
</script>

<template>
  <!-- Two framed panes and a handle between them: a hairline with a grip that turns primary under the pointer, on drag and on keyboard focus. -->
  <!-- The group sets its own inline height, so the size you give goes on this wrapper. -->
  <div :class="cn('overflow-hidden rounded-md bg-surface shadow-frame', props.class)">
  <SplitterGroup :direction="props.direction" class="h-full w-full" @layout="emit('resize', $event)">
    <SplitterPanel :default-size="props.sizes[0]" :min-size="props.minSize" class="min-h-0 min-w-0 overflow-auto"><slot name="panel-a" /></SplitterPanel>
    <SplitterResizeHandle
      class="group relative flex flex-none items-center justify-center bg-edge outline-none transition-state data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px hover:bg-primary data-[resize-handle-state=drag]:bg-primary focus-visible:bg-primary"
    >
      <!-- the hit area is wider than the hairline -->
      <span class="absolute z-10 group-data-[orientation=horizontal]:inset-y-0 group-data-[orientation=horizontal]:-inset-x-1.5 group-data-[orientation=vertical]:inset-x-0 group-data-[orientation=vertical]:-inset-y-1.5" aria-hidden="true" />
      <!-- the grip: a small slab nub -->
      <span
        class="slab-thin slab-sm z-20 shrink-0 rounded-sm border bg-surface transition-state group-hover:border-primary group-hover:bg-primary-soft group-data-[resize-handle-state=drag]:border-primary group-data-[resize-handle-state=drag]:bg-primary-soft group-focus-visible:border-primary group-focus-visible:bg-primary-soft group-data-[orientation=horizontal]:h-8 group-data-[orientation=horizontal]:w-2 group-data-[orientation=vertical]:h-2 group-data-[orientation=vertical]:w-8"
        aria-hidden="true"
      />
    </SplitterResizeHandle>
    <SplitterPanel :default-size="props.sizes[1]" :min-size="props.minSize" class="min-h-0 min-w-0 overflow-auto"><slot name="panel-b" /></SplitterPanel>
  </SplitterGroup>
  </div>
</template>
