<script setup lang="ts">
import { computed, ref } from 'vue'
import InputGroup from '@/components/ui/input-group.vue'

const site = ref('sui')
const price = ref('')
const url = ref('example.com')
const urlError = computed(() => (url.value.includes('.') ? 'Leave out the dot: the domain is added for you.' : undefined))
const weight = ref('72')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <InputGroup v-model="site" label="Website" prefix="https://" suffix=".com" />
    <InputGroup v-model="price" label="Price" prefix="$" suffix="USD" placeholder="0.00" hint="Prefix and suffix are separate segments." />
    <InputGroup v-model="url" label="Domain" prefix="https://" suffix=".com" :error="urlError" />
    <InputGroup v-model="weight" label="Weight" suffix="kg" loading />
    <InputGroup label="Read only" model-value="db.internal" prefix="host" readonly />
    <InputGroup label="Disabled" model-value="db.internal" prefix="host" disabled />
  </div>
</template>
