/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
declare module 'virtual:sui-props' {
  interface PropInfo { name: string; type: string; required: boolean; default?: string; description?: string }
  interface ComponentApi { props: PropInfo[]; models: PropInfo[]; events: { name: string; type: string }[]; slots: string[]; extends: string[] }
  const api: Record<string, ComponentApi>
  export default api
}
