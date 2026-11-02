<script setup lang="ts">
import { ref } from 'vue'
import Pagination from '@/components/ui/pagination.vue'

const middle = ref(6)
const few = ref(2)
const linked = ref(3)
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-2">
      <span class="kicker">Page {{ middle }} of 12</span>
      <Pagination v-model:page="middle" :total="120" :items-per-page="10" />
    </div>
    <div class="grid gap-2">
      <span class="kicker">Few pages</span>
      <Pagination v-model:page="few" :total="30" :items-per-page="10" />
    </div>
    <div class="grid gap-2">
      <span class="kicker">As links</span>
      <Pagination v-model:page="linked" :total="80" :items-per-page="10" :href="(n) => `#/components/pagination?page=${n}`" />
    </div>
  </div>
</template>
