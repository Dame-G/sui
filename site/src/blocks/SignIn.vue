<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Link from '@/components/ui/link.vue'
import PasswordField from '@/components/ui/password-field.vue'
import Switch from '@/components/ui/switch.vue'
import TextField from '@/components/ui/text-field.vue'
import { toast } from '@/components/ui/toast.vue'

const email = ref('')
const password = ref('')
const remember = ref(true)
</script>

<template>
  <Card title="Welcome back">
    <TextField v-model="email" label="Email" type="email" placeholder="you@example.com" />
    <PasswordField v-model="password" label="Password" />
    <Switch v-model="remember" label="Keep me signed in" />
    <Button block @click="toast({ title: 'Signed in', tone: 'success' })">Continue</Button>
    <p class="text-center text-sm text-muted"><Link href="#/blocks">Forgot your password?</Link></p>
  </Card>
</template>
