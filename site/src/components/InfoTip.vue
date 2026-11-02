<script setup lang="ts">
import Tooltip from '@/components/ui/tooltip.vue'

defineProps<{ tip: string; label: string }>()
</script>

<template>
  <Tooltip :content="tip">
    <button
      type="button"
      :aria-label="`About ${label}`"
      class="focus-ring inline-grid size-5 cursor-help place-items-center rounded-full text-muted transition-state hover:text-ink"
    >
      <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 7.9h.01" />
      </svg>
    </button>
  </Tooltip>
</template>
