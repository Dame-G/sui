<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import Toggletip from '@/components/ui/toggletip.vue'
import Tooltip from '@/components/ui/tooltip.vue'

const info =
  'inline-grid size-7 cursor-pointer place-items-center rounded-full text-muted transition-state hover:text-ink focus-ring'
</script>

<template>
  <div class="grid gap-8">
    <div class="grid gap-3">
      <span class="kicker">Click the icon; Esc or a click outside closes it</span>
      <div class="flex items-center gap-1">
        <span>Billing period</span>
        <Toggletip content="Charged on the first of each month. Changing plans mid-month is prorated.">
          <button type="button" aria-label="About billing period" :class="info">
            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.9h.01" />
            </svg>
          </button>
        </Toggletip>
      </div>
    </div>
    <div class="grid max-w-md gap-2">
      <span class="kicker">Versus a tooltip</span>
      <p class="text-muted">
        A tooltip opens on hover and focus, so touch users never see it. Use a toggletip when the text matters, or the
        screen is touch.
      </p>
      <div><Tooltip content="Hover or focus only"><Button>Tooltip</Button></Tooltip></div>
    </div>
  </div>
</template>
