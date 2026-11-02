<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Checkbox from '@/components/ui/checkbox.vue'
import RadioGroup from '@/components/ui/radio-group.vue'
import Select from '@/components/ui/select.vue'
import Sheet from '@/components/ui/sheet.vue'
import Switch from '@/components/ui/switch.vue'
import TextField from '@/components/ui/text-field.vue'

const name = ref('Northwind')
const inspectorName = ref('Northwind')
const region = ref('eu')
const plan = ref('team')
const digest = ref(true)
const beta = ref(false)
const regions = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'ap', label: 'Asia Pacific' },
]
const plans = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale' },
]
const states = ['Open', 'In review', 'Blocked', 'Done', 'Archived']
const picked = ref<Record<string, boolean>>({ Open: true })
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Settings panel</span>
      <Sheet title="Workspace settings" description="Changes save when you close.">
        <template #trigger><Button>Open settings</Button></template>
        <div class="grid gap-5">
          <TextField v-model="name" label="Workspace name" />
          <Select v-model="region" :options="regions" />
          <RadioGroup v-model="plan" :options="plans" />
          <Switch v-model="digest" label="Weekly digest" />
          <Switch v-model="beta" label="Join the beta" />
        </div>
      </Sheet>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Filters with a long list</span>
      <Sheet title="Filters" description="Narrow the results.">
        <template #trigger><Button>Open filters</Button></template>
        <div class="flex flex-col items-start gap-3">
          <Checkbox v-for="s in states" :key="s" v-model="picked[s]" :label="s" />
          <p class="pt-2 text-muted">Each filter narrows the list straight away.</p>
        </div>
      </Sheet>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">From the start edge</span>
      <Sheet title="Navigation" description="Opens from the start side." side="start">
        <template #trigger><Button>Open from the start</Button></template>
        <p class="text-muted">Flips to the right edge in right-to-left pages.</p>
      </Sheet>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Non-modal: the page behind stays usable</span>
      <Sheet title="Inspector" description="No overlay, no focus trap." :modal="false">
        <template #trigger><Button>Open inspector</Button></template>
        <div class="grid gap-3">
          <p class="text-muted">Click elsewhere on the page: this stays open. Close it with its X or Escape.</p>
          <TextField v-model="inspectorName" label="Workspace name" />
        </div>
      </Sheet>
    </div>
  </div>
</template>
