<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Separator, type SeparatorProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Separator
    :orientation="props.orientation"
    :decorative="props.decorative"
    :class="
      cn(
        // a hairline in the frame colour
        'shrink-0 border-0 border-edge',
        'data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-t',
        'data-[orientation=vertical]:min-h-[1em] data-[orientation=vertical]:w-0 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:border-s',
        props.class,
      )
    "
  />
</template>
