<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Time } from '@internationalized/date'
import type { TimeValue } from 'reka-ui'
import TimeField from '@/components/ui/time-field.vue'

const start = shallowRef<TimeValue>(new Time(9, 30))
const open = shallowRef<TimeValue>(new Time(17, 0))
const close = shallowRef<TimeValue>(new Time(8, 0))
const closeError = computed(() => (close.value && open.value && String(close.value) < String(open.value) ? 'Closing time must be after opening.' : undefined))
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <TimeField v-model="start" label="Starts at" hint="Type the digits; arrows step." />
    <TimeField :model-value="undefined" label="Not set" optional />
    <TimeField v-model="open" label="Opens" />
    <TimeField v-model="close" label="Closes" :error="closeError" />
    <TimeField :model-value="new Time(12, 0)" label="Locked" disabled />
  </div>
</template>
