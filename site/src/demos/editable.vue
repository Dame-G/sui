<script setup lang="ts">
import { reactive, ref } from 'vue'
import Card from '@/components/ui/card.vue'
import Editable from '@/components/ui/editable.vue'

const title = ref('Quarterly report')
const saved = ref('nothing yet')
const profile = reactive({ name: 'Grace Hopper', role: 'Rear Admiral', city: '' })
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <Editable v-model="title" label="Title" hint="Click the text to edit; Enter saves, Esc cancels." @submit="saved = $event" />
    <p class="text-muted">Saved: <span class="numeral text-ink">{{ saved }}</span></p>
    <Editable label="Read only" model-value="Locked" readonly />
    <Editable label="Disabled" model-value="Locked" disabled />
    <Card title="Profile" class="md:col-span-2 md:max-w-sm">
      <Editable v-model="profile.name" label="Name" />
      <Editable v-model="profile.role" label="Role" />
      <Editable v-model="profile.city" label="City" placeholder="Add a city" />
    </Card>
  </div>
</template>
