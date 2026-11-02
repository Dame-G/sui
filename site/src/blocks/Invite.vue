<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@/components/ui/avatar.vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import CheckboxGroup from '@/components/ui/checkbox-group.vue'
import Dialog from '@/components/ui/dialog.vue'
import Select from '@/components/ui/select.vue'
import TagsInput from '@/components/ui/tags-input.vue'
import { toast } from '@/components/ui/toast.vue'

const open = ref(false)
const emails = ref(['ada@example.com'])
const role = ref('member')
const access = ref(['docs'])
const team = [
  { initials: 'GH', name: 'Grace Hopper', role: 'Admin' },
  { initials: 'AT', name: 'Alan Turing', role: 'Member' },
  { initials: 'MH', name: 'Margaret Hamilton', role: 'Viewer' },
]
const roles = [
  { value: 'admin', label: 'Admin', description: 'Manage billing and people' },
  { value: 'member', label: 'Member', description: 'Create and edit' },
  { value: 'viewer', label: 'Viewer', description: 'Read only' },
]
const spaces = [
  { value: 'docs', label: 'Docs' },
  { value: 'design', label: 'Design' },
  { value: 'infra', label: 'Infrastructure' },
]
function send() {
  open.value = false
  toast({ title: `Invited ${emails.value.length}`, description: emails.value.join(', '), tone: 'success' })
}
</script>

<template>
  <Card title="Team">
    <ul class="grid gap-3">
      <li v-for="m in team" :key="m.name" class="flex items-center gap-3">
        <Avatar :fallback="m.initials" />
        <span class="grow">{{ m.name }}</span>
        <Badge>{{ m.role }}</Badge>
      </li>
    </ul>
    <Dialog v-model:open="open" title="Invite teammates" description="They get an email with a link to join.">
      <template #trigger><Button class="self-start">Invite teammates</Button></template>
      <div class="grid gap-6">
        <TagsInput v-model="emails" label="Emails" placeholder="Type an address, press Enter" />
        <Select v-model="role" label="Role" :options="roles" />
        <CheckboxGroup v-model="access" legend="Can open" :options="spaces" />
      </div>
      <template #footer>
        <Button :disabled="!emails.length" @click="send">Send invites</Button>
      </template>
    </Dialog>
  </Card>
</template>
