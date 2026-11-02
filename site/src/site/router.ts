import { computed, ref } from 'vue'

const hash = ref(location.hash || '#/')
addEventListener('hashchange', () => {
  hash.value = location.hash || '#/'
  scrollTo(0, 0)
})

export const route = computed(() => {
  const [, page = '', param = ''] = hash.value.replace(/^#/, '').split('/')
  return { page: page || 'home', param }
})
