<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/card.vue'
import Switch from '@/components/ui/switch.vue'

const airplane = ref(false)
const alerts = ref(true)
const wifi = ref(true)
const marketing = ref(false)
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <div class="grid gap-1">
      <Switch v-model="airplane" label="Airplane mode" />
      <Switch v-model="alerts" label="Alerts" description="Sounds and banners." />
      <Switch :model-value="true" label="Disabled, on" disabled />
      <Switch :model-value="false" label="Disabled" disabled />
    </div>
    <Card title="Settings">
      <Switch v-model="wifi" label="Wi-Fi" />
      <Switch v-model="marketing" label="Product news" />
    </Card>
  </div>
</template>
