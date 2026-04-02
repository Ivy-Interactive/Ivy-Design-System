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

function resolveTokenValue(value: string): string {
  if (!value.startsWith('{') || !value.endsWith('}')) return value
  const path = value.slice(1, -1).split('.')
  // path like: ivy-framework.source.color.black
  const framework = typedTokens[path[0] as 'ivy-framework']
  if (!framework) return value
  const section = framework[path[1] as keyof typeof framework] as Record<string, unknown> | undefined
  if (!section) return value
  const category = section[path[2] as string] as Record<string, TokenValue> | undefined
  if (!category) return value
  const token = category[path[3] as string]
  if (!token) return value
  return resolveTokenValue(token.value)
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function extractSourceRef(value: string): string | null {
  if (!value.startsWith('{') || !value.endsWith('}')) return null
  const parts = value.slice(1, -1).split('.')
  // e.g. ivy-framework.source.color.black -> "black"
  return parts[parts.length - 1]
}

function createColorSwatch(name: string, value: string, cssVar: string, forceTextColor?: string, sourceRef?: string | null, useResolvedBg?: boolean): HTMLElement {
  const swatch = document.createElement('div')
  swatch.className = 'color-swatch'
  swatch.style.backgroundColor = useResolvedBg ? value : `var(${cssVar})`

  const textColor = forceTextColor ?? getContrastColor(value)

  const refLine = sourceRef ? `<span class="swatch-ref">source: ${sourceRef}</span>` : ''

  swatch.innerHTML = `
    <div class="swatch-info" style="color: ${textColor}">
      <span class="swatch-name">${name}</span>
      <span class="swatch-value">${value}</span>
      <span class="swatch-var">${cssVar}</span>
      ${refLine}
    </div>
  `

  return swatch
}

function createSection(title: string, colors: ColorTokens, prefix: string = '--color-', useResolvedBg: boolean = false): HTMLElement {
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
      const resolvedValue = resolveTokenValue(token.value)
      const sourceRef = extractSourceRef(token.value)
      const forceWhite = ['border', 'border-secondary'].includes(name) ? '#ffffff' : undefined
      const swatch = createColorSwatch(name, resolvedValue, cssVar, forceWhite, sourceRef, useResolvedBg)
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

function createExamples(): HTMLElement {
  const section = document.createElement('section')
  section.className = 'color-section examples-section'
  section.innerHTML = `
    <h2>Component Examples</h2>
    <div class="examples-grid">

      <div class="example-card">
        <h3 class="example-card-title">Sign In</h3>
        <p class="example-card-description">Enter your credentials to access your account.</p>
        <label class="example-label">Email</label>
        <input class="example-input" type="email" placeholder="you@example.com" />
        <label class="example-label">Password</label>
        <input class="example-input" type="password" placeholder="••••••••" />
        <button class="example-btn example-btn-primary">Sign In</button>
        <button class="example-btn example-btn-secondary">Create Account</button>
      </div>

      <div class="example-card">
        <h3 class="example-card-title">Notifications</h3>
        <p class="example-card-description">Manage your notification preferences.</p>
        <div class="example-alert example-alert-success">Changes saved successfully.</div>
        <div class="example-alert example-alert-warning">Your trial expires in 3 days.</div>
        <div class="example-alert example-alert-destructive">Payment method declined.</div>
        <div class="example-alert example-alert-info">A new version is available.</div>
      </div>

      <div class="example-card">
        <h3 class="example-card-title">New Project</h3>
        <p class="example-card-description">Fill in the details to create a new project.</p>
        <label class="example-label">Project Name</label>
        <input class="example-input" type="text" placeholder="My Project" />
        <label class="example-label">Description</label>
        <textarea class="example-input example-textarea" placeholder="Describe your project..."></textarea>
        <div class="example-btn-row">
          <button class="example-btn example-btn-secondary">Cancel</button>
          <button class="example-btn example-btn-primary">Create</button>
        </div>
      </div>

      <div class="example-card">
        <h3 class="example-card-title">User Profile</h3>
        <p class="example-card-description">View and update your profile information.</p>
        <div class="example-avatar">JB</div>
        <div class="example-field-row">
          <span class="example-field-label">Name</span>
          <span class="example-field-value">Joel Bystedt</span>
        </div>
        <div class="example-field-row">
          <span class="example-field-label">Role</span>
          <span class="example-badge example-badge-accent">Admin</span>
        </div>
        <div class="example-field-row">
          <span class="example-field-label">Status</span>
          <span class="example-badge example-badge-success">Active</span>
        </div>
        <button class="example-btn example-btn-primary">Edit Profile</button>
      </div>

      <div class="example-card">
        <h3 class="example-card-title">Delete Workspace</h3>
        <p class="example-card-description">This action cannot be undone. All data will be permanently removed.</p>
        <div class="example-alert example-alert-destructive">All projects, files, and members will be deleted.</div>
        <label class="example-label">Type "DELETE" to confirm</label>
        <input class="example-input example-input-destructive" type="text" placeholder="DELETE" />
        <div class="example-btn-row">
          <button class="example-btn example-btn-secondary">Cancel</button>
          <button class="example-btn example-btn-destructive">Delete Workspace</button>
        </div>
      </div>

      <div class="example-card">
        <h3 class="example-card-title">Activity Feed</h3>
        <p class="example-card-description">Recent activity in your workspace.</p>
        <div class="example-activity-item">
          <span class="example-activity-dot example-dot-success"></span>
          <span class="example-activity-text">Deployment <strong>v2.4.1</strong> succeeded</span>
          <span class="example-activity-time">2m ago</span>
        </div>
        <div class="example-activity-item">
          <span class="example-activity-dot example-dot-info"></span>
          <span class="example-activity-text">PR <strong>#142</strong> merged to main</span>
          <span class="example-activity-time">15m ago</span>
        </div>
        <div class="example-activity-item">
          <span class="example-activity-dot example-dot-warning"></span>
          <span class="example-activity-text">CPU usage above <strong>80%</strong></span>
          <span class="example-activity-time">1h ago</span>
        </div>
        <div class="example-activity-item">
          <span class="example-activity-dot example-dot-destructive"></span>
          <span class="example-activity-text">Build <strong>#389</strong> failed</span>
          <span class="example-activity-time">2h ago</span>
        </div>
        <div class="example-muted-footer">View all activity</div>
      </div>

    </div>
  `
  return section
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
      'destructive', 'success', 'warning', 'info', 'border', 'border-secondary', 'ring',
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
    app.appendChild(createSection('Theme Colors (Light)', ivyFramework.theme.light.color, '--color-', true))
  }

  if (ivyFramework.theme?.dark?.color) {
    app.appendChild(createSection('Theme Colors (Dark)', ivyFramework.theme.dark.color, '--color-', true))
  }

  app.appendChild(createExamples())

  if (ivyFramework.chromatic?.color) {
    app.appendChild(createSection('Chromatic Colors', ivyFramework.chromatic.color))
  }

  if (ivyFramework.neutral?.color) {
    app.appendChild(createSection('Neutral Colors', ivyFramework.neutral.color))
  }

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme)
}

init()
