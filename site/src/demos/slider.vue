<script setup lang="ts">
import { ref } from 'vue'
import Field from '@/components/ui/field.vue'
import Slider from '@/components/ui/slider.vue'

const volume = ref([40])
const range = ref([20, 70])
const stepped = ref([30])
const budget = ref([50])
const price = ref([150, 600])
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <Field v-slot="{ id }" label="Volume" :hint="`${volume[0]}%`">
      <Slider v-model="volume" :labelledby="`${id}-label`" />
    </Field>
    <Field label="Range" :hint="`${range[0]} to ${range[1]}`">
      <Slider v-model="range" label="Range" />
    </Field>
    <Field v-slot="{ id }" label="Steps of 10" :hint="`${stepped[0]}`">
      <Slider v-model="stepped" :step="10" :labelledby="`${id}-label`" />
    </Field>
    <Field v-slot="{ id }" label="Budget" hint="Marks are decoration; the value is spoken in dollars.">
      <Slider v-model="budget" :labelledby="`${id}-label`" :value-text="(v) => `$${v}`" :marks="[{ value: 0, label: '$0' }, { value: 50, label: '$50' }, { value: 100, label: '$100' }]" />
    </Field>
    <Field label="Price" :hint="`$${price[0]} to $${price[1]}`" class="md:col-span-2">
      <Slider v-model="price" :min="0" :max="1000" :step="10" label="Price" />
    </Field>
    <Field v-slot="{ id }" label="Disabled" disabled>
      <Slider :model-value="[60]" disabled :labelledby="`${id}-label`" />
    </Field>
  </div>
</template>
