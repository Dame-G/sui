// A shared, visually hidden live region. Call announce('3 selected') from anywhere; no component needs to be mounted.
// A burst of messages collapses to the last one, so a screen reader is not read a queue.
type Politeness = 'polite' | 'assertive'

const regions: Partial<Record<Politeness, HTMLElement>> = {}
const timers: Partial<Record<Politeness, ReturnType<typeof setTimeout>>> = {}

function region(politeness: Politeness) {
  let el = regions[politeness]
  if (el?.isConnected) return el
  el = document.createElement('div')
  el.setAttribute('aria-live', politeness)
  el.setAttribute('aria-atomic', 'true')
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status')
  el.style.cssText = 'position:fixed;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;padding:0'
  document.body.append(el)
  regions[politeness] = el
  return el
}

export function announce(message: string, politeness: Politeness = 'polite') {
  if (typeof document === 'undefined' || !message) return
  const el = region(politeness)
  clearTimeout(timers[politeness])
  // Clear first, then set on the next tick, so repeating the same text is still announced.
  el.textContent = ''
  timers[politeness] = setTimeout(() => (el.textContent = message), 50)
}
