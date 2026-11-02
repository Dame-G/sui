<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

const props = defineProps<{ content: string }>()

const open = ref(false)

// Touch never hovers: a tap shows the tip for a moment (the click that follows must not close it at once).
const touching = ref(false)
let hide: ReturnType<typeof setTimeout> | undefined
function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  touching.value = true
  open.value = true
  clearTimeout(hide)
  hide = setTimeout(() => {
    open.value = false
    touching.value = false
  }, 1500)
}
onBeforeUnmount(() => clearTimeout(hide))
</script>

<template>
  <!-- 400ms to appear the first time, none when moving from one tooltip to the next (skip-delay). -->
  <TooltipProvider :delay-duration="400" :skip-delay-duration="300">
    <TooltipRoot v-model:open="open">
      <TooltipTrigger as-child :disable-closing-trigger="touching" @pointerdown="onPointerDown">
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side-offset="8"
          class="z-50 w-max max-w-56 animate-[sui-pop-in_var(--duration-fade)_var(--ease-out)] rounded-sm bg-ink px-3 py-2 text-center text-sm text-surface data-[state=closed]:animate-none"
        >
          {{ props.content }}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
