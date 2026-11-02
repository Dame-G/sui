<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{ to?: string; class?: HTMLAttributes['class'] }>(), { to: 'main' })

// Put this first in the page. It hides until the keyboard reaches it, then jumps focus past the header to the target.
// The click is handled here rather than left to the hash, so it also works in an app that routes with the hash.
function go(e: MouseEvent) {
  const target = document.getElementById(props.to)
  if (!target) return
  e.preventDefault()
  if (!target.hasAttribute('tabindex') && !/^(a|button|input|select|textarea)$/i.test(target.tagName)) target.setAttribute('tabindex', '-1')
  target.focus()
  target.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <a
    :href="`#${props.to}`"
    :class="
      cn(
        'sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-100',
        'focus:slab focus:slab-primary focus:type-button focus:inline-flex focus:h-control focus:items-center focus:bg-primary focus:px-[calc(1rem-var(--stroke-edge))] focus:text-on-primary focus:no-underline focus-ring',
        props.class,
      )
    "
    @click="go"
  >
    <slot>Skip to main content</slot>
  </a>
</template>
