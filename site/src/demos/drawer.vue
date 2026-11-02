<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Drawer from '@/components/ui/drawer.vue'
import Switch from '@/components/ui/switch.vue'

const wifi = ref(true)
const bluetooth = ref(false)
const airplane = ref(false)
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Simple, made for touch</span>
      <Drawer title="Share this page" description="Anyone with the link can view it.">
        <template #trigger><Button>Open drawer</Button></template>
        <p class="text-muted">Drag the handle down, press Escape, or tap outside to dismiss.</p>
      </Drawer>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Quick settings</span>
      <Drawer title="Quick settings" description="Applies straight away.">
        <template #trigger><Button>Open settings</Button></template>
        <div class="grid gap-4 pb-2">
          <Switch v-model="wifi" label="Wi-Fi" />
          <Switch v-model="bluetooth" label="Bluetooth" />
          <Switch v-model="airplane" label="Airplane mode" />
        </div>
      </Drawer>
    </div>
  </div>
</template>
