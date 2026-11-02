<script setup lang="ts">
import { computed, ref } from 'vue'
import CheckboxGroup from '@/components/ui/checkbox-group.vue'

const toppings = [
  { value: 'cheese', label: 'Extra cheese' },
  { value: 'olives', label: 'Olives' },
  { value: 'mushroom', label: 'Mushrooms' },
  { value: 'anchovy', label: 'Anchovies', disabled: true },
]
const picked = ref(['cheese'])
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => ({ value: d, label: d }))
const workdays = ref(['Mon', 'Wed'])
const none = ref<string[]>([])
const error = computed(() => (none.value.length ? undefined : 'Pick at least one.'))
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <CheckboxGroup v-model="picked" legend="Toppings" hint="Anchovies are sold out." :options="toppings" select-all="Everything" />
    <CheckboxGroup v-model="workdays" legend="Days" orientation="horizontal" :options="days" />
    <CheckboxGroup v-model="none" legend="Error" :options="toppings.slice(0, 3)" :error="error" />
    <CheckboxGroup :model-value="['cheese']" legend="Disabled" :options="toppings.slice(0, 3)" disabled />
  </div>
</template>
