<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import PasswordField from '@/components/ui/password-field.vue'
import TextField from '@/components/ui/text-field.vue'

const name = ref('')
const email = ref('ada@')
const emailError = computed(() => (/^\S+@\S+\.\S+$/.test(email.value) ? undefined : 'Enter a full email address.'))
const handle = ref('ada')
const price = ref('12')
const note = ref('')
const signEmail = ref('')
const signPass = ref('')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <TextField v-model="name" label="Name" placeholder="Hover and focus me" hint="As it appears on invoices." />
    <TextField v-model="email" label="Email" type="email" :error="emailError" required />
    <TextField v-model="handle" label="Handle" prefix="@" clearable />
    <TextField v-model="price" label="Price" prefix="$" suffix="USD" />
    <TextField v-model="note" label="Note" :maxlength="40" counter optional />
    <TextField label="Saving" model-value="Checking availability" loading />
    <TextField label="Read only" model-value="grace@example.com" readonly />
    <TextField label="Disabled" model-value="locked@example.com" disabled />
    <Card title="Sign in" class="md:col-span-2 md:max-w-sm">
      <TextField v-model="signEmail" label="Email" type="email" placeholder="you@example.com" />
      <PasswordField v-model="signPass" label="Password" />
      <div><Button>Sign in</Button></div>
    </Card>
  </div>
</template>
