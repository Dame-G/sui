<script setup lang="ts">
import { h, ref } from 'vue'
import Button from '@/components/ui/button.vue'

// Each button owns its busy flag, so pressing one never makes another busy.
const busy = ref({ save: false, download: false })
function run(key: 'save' | 'download') {
  busy.value[key] = true
  setTimeout(() => (busy.value[key] = false), 1800)
}
const stroke = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } as const
const Plus = () => h('svg', stroke, [h('path', { d: 'M8 3v10M3 8h10' })])
const Download = () => h('svg', stroke, [h('path', { d: 'M8 2v8M4.5 7 8 10.5 11.5 7M3 13h10' })])
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Default and disabled</p>
      <div class="flex flex-wrap gap-3">
        <Button>Save changes</Button>
        <Button disabled>Disabled</Button>
        <Button as="a" href="#/start">As a link</Button>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">With an icon: it is just a child</p>
      <div class="flex flex-wrap gap-3">
        <Button><Plus /> New project</Button>
        <Button><Download /> Download</Button>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Busy: press one. The width holds and clicks are ignored</p>
      <div class="flex flex-wrap gap-3">
        <Button :loading="busy.save" @click="run('save')">Save</Button>
        <Button :loading="busy.download" @click="run('download')"><Download /> Download</Button>
      </div>
    </div>
    <div class="flex max-w-sm flex-col gap-2">
      <p class="kicker">Full width</p>
      <Button block>Create your account</Button>
    </div>
  </div>
</template>
