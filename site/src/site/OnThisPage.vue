<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import NavList from '@/components/ui/nav-list.vue'

const props = defineProps<{ items: { id: string; label: string }[] }>()
const active = ref(props.items[0]?.id ?? '')
let observer: IntersectionObserver | undefined

// The item whose section is nearest the top of the window is the one you are reading.
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id
    },
    { rootMargin: '-15% 0px -75% 0px' },
  )
  for (const i of props.items) {
    const el = document.getElementById(i.id)
    if (el) observer.observe(el)
  }
})
onBeforeUnmount(() => observer?.disconnect())

function go(id: string | undefined) {
  if (!id) return
  active.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <!-- A map of the page, beside it: it fills the right edge so the column is not left standing alone. -->
  <div class="toc overflow-hidden rounded-md shadow-frame print:hidden">
    <NavList flush :model-value="active" :sections="[{ title: 'On this page', items: props.items.map((i) => ({ value: i.id, label: i.label })) }]" label="On this page" @update:model-value="go" />
  </div>
</template>
