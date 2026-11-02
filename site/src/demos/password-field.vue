<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import PasswordField from '@/components/ui/password-field.vue'

const current = ref('')
const short = ref('abc')
const error = computed(() => (short.value && short.value.length < 8 ? 'Use at least 8 characters.' : undefined))
const fresh = ref('')
const rules = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'A number', test: (v: string) => /\d/.test(v) },
  { label: 'An upper-case letter', test: (v: string) => /[A-Z]/.test(v) },
]
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <PasswordField v-model="current" label="Password" placeholder="Reveal with the eye" />
    <PasswordField v-model="short" label="Error" :error="error" />
    <PasswordField label="Disabled" model-value="locked" disabled />
    <Card title="Choose a password">
      <PasswordField v-model="fresh" label="New password" mode="new" :rules="rules" />
      <div><Button :disabled="rules.some((r) => !r.test(fresh))">Save</Button></div>
    </Card>
  </div>
</template>
