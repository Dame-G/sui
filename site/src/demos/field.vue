<script setup lang="ts">
import { ref } from 'vue'
import Field from '@/components/ui/field.vue'
import Slider from '@/components/ui/slider.vue'
import TextField from '@/components/ui/text-field.vue'

const volume = ref([40])
const name = ref('')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <TextField v-model="name" label="Built on Field" hint="Label, hint, error and flag come from one place." required />
    <TextField label="Optional, with a counter" :maxlength="40" counter optional />
    <TextField label="Error" model-value="" error="This field is required." required />
    <Field v-slot="{ id }" label="Around any control" :hint="`${volume[0]}%`">
      <Slider v-model="volume" :labelledby="`${id}-label`" />
    </Field>
  </div>
</template>
