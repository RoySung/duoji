import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'

import { PageScaffold } from '../src/components/ui/PageScaffold'
import { SurfaceCard } from '../src/components/ui/SurfaceCard'

const stylesheet = readFileSync(
  resolve(__dirname, '../src/pages/styles.css'),
  'utf8'
)
const tailwindConfig = readFileSync(
  resolve(__dirname, '../tailwind.config.js'),
  'utf8'
)
const headerSource = readFileSync(
  resolve(__dirname, '../src/components/layout/header.tsx'),
  'utf8'
)
const accountBookMenuSource = readFileSync(
  resolve(__dirname, '../src/components/accountBook/AccountBookMenu.tsx'),
  'utf8'
)

function readThemeVariables(selector: ':root' | '.dark') {
  const block = stylesheet.match(
    new RegExp(`${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`)
  )?.[1]

  if (!block) {
    throw new Error(`Missing ${selector} theme block`)
  }

  return Object.fromEntries(
    Array.from(block.matchAll(/(--[\w-]+):\s*([^;]+);/g), ([, key, value]) => [
      key,
      value.trim(),
    ])
  )
}

function computedVariables(theme: ':root' | '.dark') {
  const element = document.createElement('div')

  for (const [name, value] of Object.entries(readThemeVariables(theme))) {
    element.style.setProperty(name, value)
  }

  document.body.appendChild(element)
  const computed = getComputedStyle(element)
  const values = {
    background: computed.getPropertyValue('--background').trim(),
    foreground: computed.getPropertyValue('--foreground').trim(),
    primary: computed.getPropertyValue('--primary').trim(),
    emphasis: computed.getPropertyValue('--emphasis').trim(),
    emphasisContrast: computed.getPropertyValue('--emphasis-contrast').trim(),
    card: computed.getPropertyValue('--card').trim(),
    primaryForeground: computed.getPropertyValue('--primary-foreground').trim(),
    mutedForeground: computed.getPropertyValue('--muted-foreground').trim(),
    ring: computed.getPropertyValue('--ring').trim(),
  }
  element.remove()

  return values
}

function hslToRgb(value: string): [number, number, number] {
  const match = value.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)

  if (!match) {
    throw new Error(`Invalid HSL token: ${value}`)
  }

  const hue = Number(match[1])
  const saturation = Number(match[2]) / 100
  const lightness = Number(match[3]) / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const intermediate = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const offset = lightness - chroma / 2
  const sector = Math.floor(hue / 60) % 6
  const channels: [number, number, number] =
    sector === 0
      ? [chroma, intermediate, 0]
      : sector === 1
      ? [intermediate, chroma, 0]
      : sector === 2
      ? [0, chroma, intermediate]
      : sector === 3
      ? [0, intermediate, chroma]
      : sector === 4
      ? [intermediate, 0, chroma]
      : [chroma, 0, intermediate]

  return channels.map((channel) => channel + offset) as [number, number, number]
}

function colorToRgb(value: string): [number, number, number] {
  const hex = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)

  if (hex) {
    return [
      Number.parseInt(hex[1], 16) / 255,
      Number.parseInt(hex[2], 16) / 255,
      Number.parseInt(hex[3], 16) / 255,
    ]
  }

  return hslToRgb(value)
}

function relativeLuminance(value: string) {
  const channels = colorToRgb(value).map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  )

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function readHeroUIColor(
  theme: 'light' | 'dark',
  color: 'primary' | 'danger' | 'success' | 'warning'
) {
  const themeStart = tailwindConfig.indexOf(`        ${theme}: {\n          colors: {`)
  const themeEndMarker =
    theme === 'light'
      ? '\n        },\n        dark: {'
      : '\n        },\n      },\n    }),'

  if (themeStart === -1) {
    throw new Error(`Missing HeroUI ${theme} theme`)
  }

  const themeSource = tailwindConfig.slice(
    themeStart,
    tailwindConfig.indexOf(themeEndMarker, themeStart)
  )
  const colorStart = themeSource.indexOf(`            ${color}: {`)
  const colorEnd = themeSource.indexOf('\n            },', colorStart)

  if (colorStart === -1 || colorEnd === -1) {
    throw new Error(`Missing HeroUI ${theme} ${color} color`)
  }

  const colorSource = themeSource.slice(colorStart, colorEnd)
  const defaultColor = colorSource.match(/DEFAULT:\s*['"]([^'"]+)['"]/)?.[1]
  const foreground = colorSource.match(/foreground:\s*['"]([^'"]+)['"]/)?.[1]

  if (!defaultColor || !foreground) {
    throw new Error(`Missing HeroUI ${theme} ${color} default or foreground`)
  }

  return { defaultColor, foreground }
}

function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

describe('shared visual foundation', () => {
  it('provides distinct semantic roles in both themes', () => {
    const light = computedVariables(':root')
    const dark = computedVariables('.dark')

    expect(light).toEqual({
      background: '45 22% 96%',
      foreground: '169 22% 16%',
      primary: '166 21% 34%',
      emphasis: '27 95% 72%',
      emphasisContrast: '169 22% 16%',
      card: '0 0% 100%',
      primaryForeground: '0 0% 100%',
      mutedForeground: '163 9% 38%',
      ring: '166 21% 34%',
    })
    expect(dark).toEqual({
      background: '165 16% 11%',
      foreground: '36 36% 96%',
      primary: '165 22% 63%',
      emphasis: '23 100% 68%',
      emphasisContrast: '165 22% 13%',
      card: '164 17% 16%',
      primaryForeground: '165 22% 13%',
      mutedForeground: '160 10% 77%',
      ring: '165 22% 63%',
    })
  })

  it.each([':root', '.dark'] as const)(
    'meets text and focus contrast contracts in %s',
    (theme) => {
      const values = computedVariables(theme)

      expect(
        contrastRatio(values.foreground, values.background)
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrastRatio(values.mutedForeground, values.background)
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrastRatio(values.primaryForeground, values.primary)
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrastRatio(values.emphasisContrast, values.emphasis)
      ).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(values.ring, values.card)).toBeGreaterThanOrEqual(3)
    }
  )

  it.each(['light', 'dark'] as const)(
    'uses white labels with AA-contrast semantic solid fills in the %s HeroUI theme',
    (theme) => {
      for (const color of ['primary', 'danger', 'success'] as const) {
        const semanticColor = readHeroUIColor(theme, color)

        expect(semanticColor.foreground).toBe('#ffffff')
        expect(
          contrastRatio(semanticColor.foreground, semanticColor.defaultColor)
        ).toBeGreaterThanOrEqual(4.5)
      }

      const warning = readHeroUIColor(theme, 'warning')
      expect(warning.foreground).not.toBe('#ffffff')
      expect(contrastRatio(warning.foreground, warning.defaultColor)).toBeGreaterThanOrEqual(
        4.5
      )
    }
  )

  it('defines responsive gutters, safe-area clearance, and reduced motion', () => {
    expect(stylesheet).toMatch(
      /\.page-scaffold\s*\{[^}]*max-w-3xl[^}]*px-4/s
    )
    expect(stylesheet).toMatch(
      /@media \(min-width: 640px\)\s*\{[^}]*\.layout-main \.min-h-full\s*\{[^}]*padding-right:\s*1\.5rem !important;[^}]*padding-left:\s*1\.5rem !important;/s
    )
    expect(stylesheet).toMatch(
      /padding-bottom:\s*calc\(6rem \+ env\(safe-area-inset-bottom\)\)/
    )
    expect(stylesheet).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
    expect(stylesheet).toMatch(/transition-duration:\s*0\.01ms !important/)
    expect(stylesheet).toMatch(/animation-iteration-count:\s*1 !important/)
  })

  it('defines the compact semantic typography foundation and shell scale', () => {
    expect(tailwindConfig).toMatch(
      /display:\s*\[\s*'clamp\(1\.75rem, 8vw, 3rem\)'/
    )
    expect(tailwindConfig).toMatch(/headline:\s*\[\s*'1\.5rem'/)
    expect(tailwindConfig).toMatch(/title:\s*\[\s*'1\.125rem'/)
    expect(tailwindConfig).toMatch(/body:\s*\[\s*'0\.875rem'/)
    expect(tailwindConfig).toMatch(/label:\s*\[\s*'0\.75rem'/)
    expect(headerSource).toContain('text-lg')
    expect(accountBookMenuSource).toContain('<PiBooksBold size={14} />')
    expect(accountBookMenuSource).toContain('text-sm text-foreground')
  })

  it('forwards standard DOM attributes through PageScaffold', () => {
    render(
      <PageScaffold aria-label="Transaction page" className="custom-page">
        Page content
      </PageScaffold>
    )

    const page = screen.getByLabelText('Transaction page')
    expect(page.getAttribute('data-ui')).toBe('page-scaffold')
    expect(page.classList.contains('page-scaffold')).toBe(true)
    expect(page.classList.contains('custom-page')).toBe(true)
    expect(page.textContent).toContain('Page content')
  })

  it('forwards standard DOM attributes through SurfaceCard', () => {
    render(
      <SurfaceCard role="region" aria-label="Balance" className="custom-card">
        Balance content
      </SurfaceCard>
    )

    const card = screen.getByRole('region', { name: 'Balance' })
    expect(card.getAttribute('data-ui')).toBe('surface-card')
    expect(card.classList.contains('surface-card')).toBe(true)
    expect(card.classList.contains('custom-card')).toBe(true)
    expect(card.textContent).toContain('Balance content')
  })
})
