<script setup lang="ts">
import { ref } from 'vue'
import Textarea from '@/components/ui/textarea.vue'

const message = ref('')
const grown = ref('Type a few lines and I grow with you.')
const bio = ref('A short bio.')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <Textarea v-model="message" label="Message" placeholder="Hover and focus me" hint="Plain text only." />
    <Textarea v-model="bio" label="Bio" :maxlength="120" counter optional />
    <Textarea v-model="grown" label="Grows with the text" auto-grow />
    <Textarea label="Error" model-value="" error="Write something first." required />
    <Textarea label="Saving" model-value="Autosaving your draft" loading />
    <Textarea label="Read only" model-value="Locked by an admin." readonly />
    <Textarea label="Disabled" model-value="Locked by an admin." disabled />
  </div>
</template>
