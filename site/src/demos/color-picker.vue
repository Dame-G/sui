<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPicker from '@/components/ui/color-picker.vue'

const brand = ref('#2c95b4')
const accent = ref('#f4efe2')

// A rough light-or-dark test, to show the error state.
const tooLight = computed(() => {
  const n = parseInt(accent.value.slice(1), 16)
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 170
})
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-3">
    <div class="grid content-start gap-3">
      <ColorPicker v-model="brand" label="Brand colour" />
      <p class="numeral text-sm text-muted">Picked: {{ brand }}</p>
    </div>
    <ColorPicker v-model="accent" label="Accent" :swatches="['#d6561f', '#f4efe2', '#7a3e9d', '#1d4e5a']" :error="tooLight ? 'Too light for white text.' : undefined" />
    <ColorPicker model-value="#7a3e9d" label="Locked" disabled />
  </div>
</template>
