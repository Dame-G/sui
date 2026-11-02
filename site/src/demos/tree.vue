<script setup lang="ts">
import { ref } from 'vue'
import Tree, { type TreeNode } from '@/components/ui/tree.vue'

const file = ref('button.vue')
const chevronPick = ref('phones')
const files: TreeNode[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [
          { value: 'button.vue', label: 'button.vue' },
          { value: 'dialog.vue', label: 'dialog.vue' },
          { value: 'tree.vue', label: 'tree.vue' },
        ],
      },
      { value: 'lib', label: 'lib', children: [{ value: 'utils.ts', label: 'utils.ts' }] },
      { value: 'main.ts', label: 'main.ts' },
    ],
  },
  { value: 'public', label: 'public', children: [{ value: 'favicon.svg', label: 'favicon.svg' }] },
  { value: 'package.json', label: 'package.json' },
  { value: 'README.md', label: 'README.md' },
]
const store: TreeNode[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    children: [
      { value: 'phones', label: 'Phones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'audio', label: 'Audio', children: [{ value: 'headphones', label: 'Headphones' }, { value: 'speakers', label: 'Speakers' }] },
    ],
  },
  { value: 'home', label: 'Home', children: [{ value: 'kitchen', label: 'Kitchen' }, { value: 'garden', label: 'Garden' }] },
  { value: 'books', label: 'Books' },
]
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div class="grid content-start gap-3">
      <span class="kicker">Files · {{ file }}</span>
      <div class="max-w-xs overflow-hidden rounded-md shadow-frame">
        <Tree v-model="file" :items="files" :default-expanded="['src', 'components']" />
      </div>
    </div>
    <div class="grid content-start gap-3">
      <span class="kicker">Toggle on the chevron only · {{ chevronPick }}</span>
      <div class="max-w-xs overflow-hidden rounded-md shadow-frame">
        <Tree v-model="chevronPick" :items="store" toggle-on="chevron" :default-expanded="['electronics']" />
      </div>
    </div>
  </div>
</template>
