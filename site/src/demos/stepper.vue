<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Notice from '@/components/ui/notice.vue'
import RadioGroup from '@/components/ui/radio-group.vue'
import Stepper from '@/components/ui/stepper.vue'
import TextField from '@/components/ui/text-field.vue'

const step = ref(2)
const name = ref('Grace Hopper')
const plan = ref('team')
const steps = [
  { value: 1, title: 'Account', description: 'Your details' },
  { value: 2, title: 'Plan', description: 'Pick a tier' },
  { value: 3, title: 'Done' },
]
const plans = [
  { value: 'solo', label: 'Solo: one project' },
  { value: 'team', label: 'Team: unlimited projects' },
]
const withError = [{ value: 1, title: 'Account' }, { value: 2, title: 'Plan', error: true }, { value: 3, title: 'Payment' }]
const vstep = ref(2)
</script>

<template>
  <div class="grid gap-10 overflow-x-auto">
    <div class="grid gap-5">
      <span class="kicker">A flow</span>
      <Stepper v-model="step" :steps="steps" />
      <div class="grid max-w-md gap-4">
        <TextField v-if="step === 1" v-model="name" label="Full name" />
        <RadioGroup v-else-if="step === 2" v-model="plan" :options="plans" />
        <Notice v-else tone="success" title="You're all set">Welcome aboard, {{ name }}.</Notice>
      </div>
      <div class="flex gap-2">
        <Button :disabled="step === 1" @click="step--">Back</Button>
        <Button :disabled="step === steps.length" @click="step++">Next</Button>
      </div>
    </div>
    <div class="grid gap-3">
      <span class="kicker">An error on a step</span>
      <Stepper :model-value="3" :steps="withError" />
    </div>
    <div class="grid gap-3">
      <span class="kicker">Vertical</span>
      <Stepper v-model="vstep" :steps="steps" orientation="vertical" />
    </div>
  </div>
</template>
