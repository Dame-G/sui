<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/card.vue'
import NavList from '@/components/ui/nav-list.vue'

const side = ref('overview')
const top = ref('overview')
const marker = ref('activity')
const inContext = ref('profile')
const sections = [
  { items: [{ value: 'overview', label: 'Overview' }, { value: 'activity', label: 'Activity' }] },
  { title: 'Workspace', items: [{ value: 'projects', label: 'Projects' }, { value: 'members', label: 'Members' }, { value: 'billing', label: 'Billing' }] },
]
const settings = [
  { title: 'Account', items: [{ value: 'profile', label: 'Profile' }, { value: 'security', label: 'Security' }, { value: 'notifications', label: 'Notifications' }] },
  { title: 'Team', items: [{ value: 'people', label: 'People' }, { value: 'roles', label: 'Roles' }] },
]
const copy: Record<string, string> = {
  profile: 'Your name, photo and the address people reach you on.',
  security: 'Passwords, two-factor codes and active sessions.',
  notifications: 'Choose what lands in your inbox, and when.',
  people: 'Invite teammates and remove access.',
  roles: 'Decide who can edit, review or only read.',
}
</script>

<template>
  <div class="grid gap-8">
    <div class="grid gap-3">
      <span class="kicker">Vertical, with sections · {{ side }}</span>
      <div class="max-w-64 overflow-hidden rounded-md shadow-frame"><NavList v-model="side" :sections="sections" /></div>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Flush: the current row runs to the edge · {{ marker }}</span>
      <div class="max-w-64 overflow-hidden rounded-md shadow-frame"><NavList v-model="marker" flush :sections="sections" /></div>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Horizontal · {{ top }}</span>
      <div class="overflow-hidden rounded-md shadow-frame"><NavList v-model="top" :sections="sections" orientation="horizontal" /></div>
    </div>
    <div class="grid gap-3">
      <span class="kicker">In a settings page</span>
      <div class="flex flex-col items-start gap-4 md:flex-row">
        <div class="w-full overflow-hidden rounded-md shadow-frame md:w-64 md:shrink-0"><NavList v-model="inContext" :sections="settings" /></div>
        <Card :title="inContext[0]!.toUpperCase() + inContext.slice(1)" class="w-full md:flex-1"><p class="text-muted">{{ copy[inContext] }}</p></Card>
      </div>
    </div>
  </div>
</template>
