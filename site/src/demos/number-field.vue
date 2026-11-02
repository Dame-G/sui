<script setup lang="ts">
import { ref } from 'vue'
import NumberField from '@/components/ui/number-field.vue'

const guests = ref(2)
const qty = ref(10)
const rooms = ref(9)
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <NumberField v-model="guests" label="Guests" :min="1" :max="8" hint="Between 1 and 8." />
    <NumberField v-model="qty" label="Quantity" :min="0" :max="100" :step="5" hint="Steps of 5." />
    <NumberField v-model="rooms" label="Rooms" :min="1" :max="10" :error="rooms > 8 ? 'We only have 8 rooms.' : undefined" />
    <NumberField label="Saving" :model-value="3" loading />
    <NumberField label="Read only" :model-value="3" readonly />
    <NumberField label="Disabled" :model-value="3" disabled />
  </div>
</template>
