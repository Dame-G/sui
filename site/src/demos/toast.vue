<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import { toast } from '@/components/ui/toast.vue'

const fakeUpload = () => new Promise<void>((resolve) => setTimeout(resolve, 1800))
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">The five tones</p>
      <div class="flex flex-wrap gap-3">
        <Button @click="toast({ title: 'Copied to clipboard', tone: 'neutral' })">Neutral</Button>
        <Button @click="toast({ title: 'New version available', description: 'Reload to update.', tone: 'info' })">Info</Button>
        <Button @click="toast({ title: 'Saved', description: 'Your changes are live.', tone: 'success' })">Success</Button>
        <Button @click="toast({ title: 'Storage almost full', description: '92% of 5 GB used.', tone: 'warning' })">Warning</Button>
        <Button @click="toast({ title: 'Upload failed', description: 'Check your connection.', tone: 'danger' })">Danger</Button>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Options</p>
      <div class="flex flex-wrap gap-3">
        <Button @click="toast({ title: 'Message archived', tone: 'success', action: { label: 'Undo', onClick: () => toast({ title: 'Restored', tone: 'info' }) } })">With an action</Button>
        <Button @click="toast({ key: 'sync', title: 'Syncing…', description: new Date().toLocaleTimeString(), tone: 'info' })">Same key updates</Button>
        <Button @click="toast.promise(fakeUpload(), { loading: 'Uploading…', success: 'Uploaded', error: 'Upload failed' })">Follow a promise</Button>
      </div>
    </div>
    <p class="max-w-md text-muted">
      Call <code class="numeral">toast()</code> from anywhere; one <code class="numeral">&lt;Toaster /&gt;</code> mounted once in your app shows them.
      Danger toasts and toasts with an action stay until dismissed.
    </p>
  </div>
</template>
