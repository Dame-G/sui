<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '@/components/ui/checkbox.vue'
import Fieldset from '@/components/ui/fieldset.vue'
import RadioGroup from '@/components/ui/radio-group.vue'

const plan = ref('team')
const plans = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale' },
]
const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <Fieldset legend="Plan" hint="You can change it later."><RadioGroup v-model="plan" :options="plans" /></Fieldset>
    <Fieldset legend="Notify me" error="Pick at least one.">
      <Checkbox v-model="a" label="Email" />
      <Checkbox v-model="b" label="Text message" />
    </Fieldset>
    <Fieldset legend="In a row" orientation="horizontal">
      <Checkbox v-model="a" label="Email" />
      <Checkbox v-model="b" label="Text" />
    </Fieldset>
    <Fieldset legend="Disabled" disabled>
      <Checkbox :model-value="true" label="Email" />
      <Checkbox :model-value="false" label="Text message" />
    </Fieldset>
  </div>
</template>
