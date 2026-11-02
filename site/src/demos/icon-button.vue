<script setup lang="ts">
import { ref } from 'vue'
import IconButton from '@/components/ui/icon-button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu.vue'

const busy = ref(false)
function refresh() {
  busy.value = true
  setTimeout(() => (busy.value = false), 1600)
}
const stroke = { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } as const
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Hover or focus for the label</p>
      <div class="flex flex-wrap items-center gap-3">
        <IconButton label="Add"><svg viewBox="0 0 16 16" v-bind="stroke"><path d="M8 3v10M3 8h10" /></svg></IconButton>
        <IconButton label="Search"><svg viewBox="0 0 16 16" v-bind="stroke"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg></IconButton>
        <IconButton label="Settings"><svg viewBox="0 0 24 24" v-bind="stroke"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></svg></IconButton>
        <IconButton label="Unavailable" disabled><svg viewBox="0 0 16 16" v-bind="stroke"><path d="M3 8h10" /></svg></IconButton>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Busy: press refresh</p>
      <div><IconButton label="Refresh" :loading="busy" @click="refresh"><svg viewBox="0 0 16 16" v-bind="stroke"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5V5h-2.5" /></svg></IconButton></div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">As a menu trigger, with the tooltip off</p>
      <DropdownMenu :items="[{ value: 'rename', label: 'Rename' }, { value: 'duplicate', label: 'Duplicate' }, { value: 'delete', label: 'Delete' }]">
        <template #trigger>
          <IconButton label="More actions" :tooltip="false"><svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3.5" cy="8" r="1.4" /><circle cx="8" cy="8" r="1.4" /><circle cx="12.5" cy="8" r="1.4" /></svg></IconButton>
        </template>
      </DropdownMenu>
    </div>
  </div>
</template>
