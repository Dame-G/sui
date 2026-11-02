<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ items: { value: string; title: string }[]; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <!-- Hairlines between the rows, a wash under the one you point at. -->
  <AccordionRoot type="single" collapsible :class="cn('border-b border-edge', props.class)">
    <AccordionItem v-for="item in props.items" :key="item.value" :value="item.value" class="border-t border-edge">
      <AccordionHeader class="m-0">
        <AccordionTrigger
          class="group flex min-h-tap w-full cursor-pointer items-center justify-between gap-3 px-2 py-2 text-start font-medium leading-snug text-ink transition-state hover:bg-wash-hover active:bg-wash-press focus-inset"
        >
          {{ item.title }}
          <svg
            viewBox="0 0 16 16"
            class="size-5 shrink-0 transition-transform duration-(--duration-tap) ease-(--ease-out) group-data-[state=open]:rotate-180"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent
        class="overflow-hidden data-[state=closed]:animate-[sui-accordion-up_var(--duration-move)_var(--ease-out)] data-[state=open]:animate-[sui-accordion-down_var(--duration-move)_var(--ease-out)]"
      >
        <div class="px-2 pt-1 pb-3 text-muted"><slot :name="item.value" /></div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
