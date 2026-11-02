import { plugin as shadcn } from '@shadcn/lint'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import vueParser from 'vue-eslint-parser'

const settings = { shadcn: { ui: '@/components/ui', css: 'site/src/style.css' } }

export default defineConfig([
  { ignores: ['**/dist/**', '**/node_modules/**', 'site/public/**'] },
  {
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser, parserOptions: { parser: tsParser } },
    plugins: { shadcn },
    settings,
    rules: {
      // Consumers (pages) may position sui components, not restyle them.
      'shadcn/no-restyle': ['error', { allow: ['layout'] }],
      'shadcn/no-raw-colors': 'error',
      'shadcn/no-arbitrary-values': 'error',
      'shadcn/no-inline-styles': 'error',
    },
  },
  {
    // The component source is yours to edit freely.
    files: ['registry/**/*.vue'],
    rules: {
      'shadcn/no-restyle': 'off',
      'shadcn/no-arbitrary-values': 'off',
      'shadcn/no-inline-styles': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tsParser },
    plugins: { shadcn },
    settings,
  },
])
