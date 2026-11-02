<script setup lang="ts">
import { computed, ref } from 'vue'
import PinInput from '@/components/ui/pin-input.vue'

const code = ref('')
const done = ref(false)
const error = computed(() => (done.value && code.value !== '123456' ? 'That code is not right. Try 123456.' : undefined))
const grouped = ref('')
const letters = ref('')
const short = ref('')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <PinInput v-model="code" label="Code" hint="Paste works. Try 123456." :error="error" @complete="done = true" />
    <PinInput v-model="grouped" label="In groups of three" :group-size="3" charset="numeric" />
    <PinInput v-model="letters" label="Letters and digits" :length="4" charset="alphanumeric" />
    <PinInput v-model="short" label="Four digits" :length="4" charset="numeric" optional />
    <PinInput label="Read only" model-value="123456" readonly />
    <PinInput label="Disabled" model-value="123456" disabled />
  </div>
</template>
