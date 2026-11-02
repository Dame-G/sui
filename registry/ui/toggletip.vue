<script setup lang="ts">
import { watch } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { announce } from '@/lib/announce'

const props = defineProps<{ content: string }>()
const open = defineModel<boolean>('open', { default: false })
watch(open, (o) => o && announce(props.content))
// Focus stays on the button (the text is announced through the live region), so Tab carries on from where you were.
function onOpenAutoFocus(e: Event) {
  e.preventDefault()
}
</script>

<template>
  <!-- A tooltip you click. It works on touch and for screen readers, which never get hover, and its text is announced when it opens. -->
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        @open-auto-focus="onOpenAutoFocus"
        :side-offset="8"
        :collision-padding="8"
        class="panel w-max max-w-64 px-3 py-2 text-sm leading-normal focus-inset"
      >
        {{ content }}
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
