<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Dialog from '@/components/ui/dialog.vue'
import TextField from '@/components/ui/text-field.vue'

const inviteOpen = ref(false)
const email = ref('')
const sent = ref('')
function send() {
  sent.value = email.value || 'nobody yet'
  inviteOpen.value = false
  email.value = ''
}
const terms = Array.from({ length: 12 }, (_, i) => `Clause ${i + 1}. The parties agree to keep their code open and their tokens consistent.`)
const forcedOpen = ref(false)
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">A message</span>
      <Dialog title="Delete project?" description="This can't be undone.">
        <template #trigger><Button>Open dialog</Button></template>
        All of the project's files and history will be permanently removed.
      </Dialog>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">A form, focus starts in the field · last invite: {{ sent || 'none' }}</span>
      <Dialog v-model:open="inviteOpen" title="Invite a teammate" description="They'll get an email with a link.">
        <template #trigger><Button>Invite teammate</Button></template>
        <TextField v-model="email" label="Email" type="email" placeholder="name@company.com" data-autofocus />
        <template #footer><Button @click="send">Send invite</Button></template>
      </Dialog>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Long content scrolls inside; not dismissible variant below</span>
      <div class="flex flex-wrap gap-2">
        <Dialog title="Terms of use" description="Please read to the end.">
          <template #trigger><Button>Read the terms</Button></template>
          <p v-for="t in terms" :key="t" class="pb-3 text-muted">{{ t }}</p>
        </Dialog>
        <Dialog v-model:open="forcedOpen" title="Accept the terms" description="You need to choose to continue." :dismissible="false">
          <template #trigger><Button>Not dismissible</Button></template>
          Read the policy, then accept.
          <template #footer><Button @click="forcedOpen = false">I accept</Button></template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
