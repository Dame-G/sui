<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Form from '@/components/ui/form.vue'
import InputGroup from '@/components/ui/input-group.vue'
import Select from '@/components/ui/select.vue'
import Textarea from '@/components/ui/textarea.vue'
import TextField from '@/components/ui/text-field.vue'
import { toast } from '@/components/ui/toast.vue'

const name = ref('Grace Hopper')
const handle = ref('amazing-grace')
const zone = ref('utc')
const bio = ref('')
const saving = ref(false)
const zones = [
  { value: 'utc', label: 'UTC' },
  { value: 'est', label: 'New York' },
  { value: 'cet', label: 'Berlin' },
]
function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    toast({ title: 'Profile saved', tone: 'success' })
  }, 700)
}
</script>

<template>
  <Card title="Profile">
    <Form :submitting="saving" @submit="save">
      <div class="grid gap-6 sm:grid-cols-2">
        <TextField v-model="name" label="Name" required />
        <InputGroup v-model="handle" label="Handle" prefix="sui.dev/" required />
      </div>
      <Select v-model="zone" label="Time zone" :options="zones" />
      <Textarea v-model="bio" label="Bio" optional :maxlength="140" counter hint="A line or two about you." />
      <div><Button :loading="saving" type="submit">Save changes</Button></div>
    </Form>
  </Card>
</template>
