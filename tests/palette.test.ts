// The palette promises WCAG contrast for any brand colour. These are the numbers that must not drift.
import { describe, expect, test } from 'bun:test'
import { buildPalette, contrast, defaultBrand, derivePrimary, fromOklch, isHex, settle, toOklch } from '../site/src/site/palette'

const brands = [defaultBrand, '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff', '#000000', '#7a7a7a', '#e11d8f', '#f59e0b']

describe('contrast', () => {
  test('known ratios', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5)
  })
  test('OKLCH round-trips', () => {
    for (const hex of ['#2c95b4', '#e11d8f', '#808080']) {
      const { L, C, h } = toOklch(hex)
      expect(fromOklch(L, C, h)).toBe(hex)
    }
  })
})

describe('settle', () => {
  test('reaches the target when it can', () => {
    const r = settle('#9bcde3', ['#ffffff'], 4.5)
    expect(r.ok).toBe(true)
    expect(contrast(r.color, '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })
  test('reports failure instead of hiding it', () => {
    expect(settle('#777777', ['#777777', '#ffffff', '#000000'], 7).ok).toBe(false)
  })
})

describe('buildPalette', () => {
  for (const brand of brands)
    for (const scheme of ['light', 'dark'] as const)
      for (const level of ['normal', 'high'] as const)
        test(`${brand} ${scheme} ${level}: every pair passes, tokens are hex`, () => {
          const { tokens, issues } = buildPalette(brand, scheme, level)
          expect(issues).toEqual([])
          for (const [k, v] of Object.entries(tokens)) if (k !== '--color-scrim') expect(isHex(v)).toBe(true)
        })

  test('action colour keeps AAA text', () => {
    for (const brand of brands)
      for (const scheme of ['light', 'dark'] as const) {
        const on = scheme === 'light' ? '#ffffff' : '#00212b'
        expect(contrast(derivePrimary(brand, scheme), on)).toBeGreaterThanOrEqual(7)
      }
  })
})
