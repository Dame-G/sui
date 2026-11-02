<script setup lang="ts">
import { ref } from 'vue'
import NavList from '@/components/ui/nav-list.vue'
import Resizable from '@/components/ui/resizable.vue'

const file = ref('button.vue')
const sections = [
  { title: 'Files', items: [{ value: 'button.vue', label: 'button.vue' }, { value: 'dialog.vue', label: 'dialog.vue' }, { value: 'tabs.vue', label: 'tabs.vue' }] },
]
</script>

<template>
  <div class="grid gap-8">
    <div class="grid gap-2">
      <p class="kicker">An editor: files, code and a console</p>
      <Resizable :sizes="[28, 72]" :min-size="15" class="h-80 max-w-3xl">
        <template #panel-a><NavList v-model="file" :sections="sections" label="Files" /></template>
        <template #panel-b>
          <Resizable direction="vertical" :sizes="[65, 35]" :min-size="20" class="h-full">
            <template #panel-a>
              <pre class="numeral p-4 text-sm leading-relaxed text-ink">// {{ file }}
export const label = 'sui'
export const depth = 2</pre>
            </template>
            <template #panel-b>
              <p class="numeral p-4 text-sm leading-relaxed text-muted">✓ typecheck passed<br />✓ lint passed</p>
            </template>
          </Resizable>
        </template>
      </Resizable>
    </div>
  </div>
</template>
