import '@ivy-interactive/ivy-design-system/css/ivy-framework-source'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-light'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-dark'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-chromatic'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-neutral'
import tokens from '@ivy-interactive/ivy-design-system/tokens'
import './style.css'

interface TokenValue {
  value: string
  type: string
}

interface ColorTokens {
  [key: string]: TokenValue
}

interface TokenStructure {
  'ivy-framework'?: {
    source?: {
      color?: ColorTokens
    }
    theme?: {
      light?: { color?: ColorTokens }
      dark?: { color?: ColorTokens }
    }
    neutral?: {
      color?: ColorTokens
    }
    chromatic?: {
      color?: ColorTokens
    }
  }
}

const typedTokens = tokens as TokenStructure

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function createColorSwatch(name: string, value: string, cssVar: string): HTMLElement {
  const swatch = document.createElement('div')
  swatch.className = 'color-swatch'
  swatch.style.backgroundColor = `var(${cssVar})`

  const textColor = getContrastColor(value)

  swatch.innerHTML = `
    <div class="swatch-info" style="color: ${textColor}">
      <span class="swatch-name">${name}</span>
      <span class="swatch-value">${value}</span>
      <span class="swatch-var">${cssVar}</span>
    </div>
  `

  return swatch
}

function createSection(title: string, colors: ColorTokens, prefix: string = '--color-'): HTMLElement {
  const section = document.createElement('section')
  section.className = 'color-section'

  const header = document.createElement('h2')
  header.textContent = title
  section.appendChild(header)

  const grid = document.createElement('div')
  grid.className = 'color-grid'

  for (const [name, token] of Object.entries(colors)) {
    if (token.type === 'color') {
      const cssVar = `${prefix}${name}`
      const swatch = createColorSwatch(name, token.value, cssVar)
      grid.appendChild(swatch)
    }
  }

  section.appendChild(grid)
  return section
}

function toggleTheme(): void {
  document.documentElement.classList.toggle('dark')
  const isDark = document.documentElement.classList.contains('dark')
  const themeBtn = document.getElementById('theme-toggle')
  if (themeBtn) {
    themeBtn.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
  }
}

function init(): void {
  const app = document.getElementById('app')
  if (!app) return

  const header = document.createElement('header')
  header.innerHTML = `
    <h1>Ivy Design System - Color Tokens</h1>
    <p>This demo displays all colors from the <code>@ivy-interactive/ivy-design-system</code> package</p>
    <button id="theme-toggle">Switch to Dark Mode</button>
  `
  app.appendChild(header)

  const ivyFramework = typedTokens['ivy-framework']
  if (!ivyFramework) {
    app.innerHTML += '<p>No tokens found</p>'
    return
  }

  if (ivyFramework.source?.color) {
    const sourceColors = ivyFramework.source.color
    const primaryColors: ColorTokens = {}
    const paletteColors: ColorTokens = {}

    const primaryColorNames = [
      'primary', 'black', 'white', 'secondary-light', 'secondary-dark',
      'destructive', 'success', 'warning', 'info', 'border', 'ring',
      'muted-light', 'muted-dark', 'muted-foreground',
      'accent-foreground-light', 'card-foreground-light', 'card-dark', 'background-dark'
    ]

    for (const [name, token] of Object.entries(sourceColors)) {
      if (primaryColorNames.includes(name)) {
        primaryColors[name] = token
      } else {
        paletteColors[name] = token
      }
    }

    app.appendChild(createSection('Source Colors', primaryColors))
    app.appendChild(createSection('Color Palette', paletteColors))
  }

  if (ivyFramework.theme?.light?.color) {
    app.appendChild(createSection('Theme Colors (Light/Dark)', ivyFramework.theme.light.color))
  }

  if (ivyFramework.chromatic?.color) {
    app.appendChild(createSection('Chromatic Colors', ivyFramework.chromatic.color))
  }

  if (ivyFramework.neutral?.color) {
    app.appendChild(createSection('Neutral Colors', ivyFramework.neutral.color))
  }

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme)
}

init()
