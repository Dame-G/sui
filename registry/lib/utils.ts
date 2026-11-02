import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the sui tokens, so `cn('h-control', 'h-10')` overrides and `font-strong` isn't mistaken for a font family.
const twMerge = extendTailwindMerge({
  extend: {
    theme: { spacing: ['control', 'tap', 'chip', 'check'] },
    classGroups: {
      'font-weight': [{ font: ['regular', 'strong'] }],
      shadow: [{ shadow: ['frame', 'well', 'float', 'drop'] }],
      animate: [{ animate: ['ring', 'stripes', 'slide', 'pulse-soft'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** For a well that holds an input plus affixes: a click on its padding or a prefix lands in the input, buttons keep their own click. */
export function focusInput(e: MouseEvent) {
  const box = e.currentTarget as HTMLElement
  const target = e.target as HTMLElement
  if (target.closest('button, a, [role=button]')) return
  const input = box.querySelector<HTMLElement>('input, textarea')
  if (input && target !== input) {
    e.preventDefault()
    input.focus()
  }
}
