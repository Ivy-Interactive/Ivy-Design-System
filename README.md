# Ivy Design System

> Modular multi-product token-based design system for Ivy products

A centralized design token system that provides consistent styling across Ivy-Web, Ivy-Framework, and future Ivy products. Built with TypeScript, generates CSS variables, Tailwind configs, and JavaScript/TypeScript exports.

## Features

- 🎨 **260+ Design Tokens** - Colors, typography, spacing, shadows, and more
- 🏢 **Multi-Product Support** - Product-specific variants for Ivy-Web and Ivy-Framework
- 🌗 **Light/Dark Themes** - Built-in theme support
- 📦 **Multiple Formats** - CSS variables, Tailwind configs, JS/TS exports
- 🔒 **Type-Safe** - Full TypeScript support with autocomplete
- 🎯 **Framework Agnostic** - Use with any framework or vanilla CSS

## Installation

### Frontend (npm)

```bash
npm install ivy-design-system
```

### Backend (.NET)

```bash
dotnet add package Ivy.DesignSystem
```

## Quick Start

### CSS Variables

Import the CSS file for your product:

```css
/* For Ivy-Web */
@import 'ivy-design-system/css/ivy-web';
@import 'ivy-design-system/css/light'; /* or dark */

/* For Ivy-Framework */
@import 'ivy-design-system/css/ivy-framework';
@import 'ivy-design-system/css/light'; /* or dark */

/* Use tokens in your CSS */
.my-component {
  background-color: var(--color-brand-primary);
  padding: var(--spacing-unit);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Tailwind Configuration

Extend your Tailwind config with design tokens:

```javascript
// tailwind.config.js
import ivyTokens from 'ivy-design-system/tailwind/ivy-web';

export default {
  ...ivyTokens,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [],
};
```

Then use in your components:

```jsx
<div className="bg-color-brand-primary text-color-text-primary p-spacing-unit rounded-radius-lg shadow-shadow-md">
  Hello Ivy!
</div>
```

### JavaScript/TypeScript

Import tokens directly in your code:

```typescript
import { tokens } from 'ivy-design-system';

const styles = {
  backgroundColor: tokens['color-brand-primary'],
  padding: tokens['spacing-unit'],
  borderRadius: tokens['radius-lg'],
};
```

With full TypeScript autocomplete:

```typescript
import type { TokenName } from 'ivy-design-system';

const tokenName: TokenName = 'color-brand-primary'; // ✅ Autocomplete works!
const invalidToken: TokenName = 'not-a-token'; // ❌ TypeScript error
```

### C# / ASP.NET

Use design tokens in your .NET backend:

```csharp
using Ivy.Themes;

// Access tokens via static properties
var primaryColor = CoreTokens.Color.BrandPrimary;
var spacing = CoreTokens.Spacing.Unit;

// Generate CSS for embedding in pages
string css = CoreTokens.GenerateCSS();

// Get a specific token by name
var token = CoreTokens.GetToken("color-brand-primary");

// Get all tokens as a dictionary
var allTokens = CoreTokens.GetAllTokens();
```

Product-specific tokens:

```csharp
// Ivy-Framework tokens
var frameworkColor = IvyFrameworkTokens.Color.BrandPrimary;

// Ivy-Web tokens
var webColor = IvyWebTokens.Color.BrandPrimary;

// Theme tokens
var lightBg = LightThemeTokens.Color.Background;
var darkBg = DarkThemeTokens.Color.Background;
```

## Available Exports

### Frontend (npm)

| Export Path | Description |
|-------------|-------------|
| `ivy-design-system` | JavaScript/TypeScript token exports |
| `ivy-design-system/css/core` | Core design tokens (shared across products) |
| `ivy-design-system/css/ivy-web` | Ivy-Web specific tokens |
| `ivy-design-system/css/ivy-framework` | Ivy-Framework specific tokens |
| `ivy-design-system/css/light` | Light theme tokens |
| `ivy-design-system/css/dark` | Dark theme tokens |
| `ivy-design-system/tailwind/core` | Core Tailwind config |
| `ivy-design-system/tailwind/ivy-web` | Ivy-Web Tailwind config |
| `ivy-design-system/tailwind/ivy-framework` | Ivy-Framework Tailwind config |
| `ivy-design-system/tokens` | Raw JSON tokens |

### Backend (.NET)

| Namespace | Description |
|-----------|-------------|
| `Ivy.Themes.CoreTokens` | Core design tokens (shared across products) |
| `Ivy.Themes.IvyFrameworkTokens` | Ivy-Framework specific tokens |
| `Ivy.Themes.IvyWebTokens` | Ivy-Web specific tokens |
| `Ivy.Themes.LightThemeTokens` | Light theme tokens |
| `Ivy.Themes.DarkThemeTokens` | Dark theme tokens |

## Token Categories

### Colors
- **Brand Colors**: Primary teal palette, mint accents
- **Semantic Colors**: Surface, text, border, status colors
- **Extended Palette** (Ivy-Framework): 20+ colors with variants
- **Shadcn Tokens** (Ivy-Web): OKLch color system for Shadcn UI

### Typography
- **Font Families**: Geist, Geist Mono, IBM Plex Mono
- **Font Sizes**: 5px to 60px scale
- **Line Heights**: 12px to 60px
- **Letter Spacing**: -5% to 14%
- **Tracking**: Tighter to widest

### Spacing & Layout
- **Spacing Unit**: Base spacing (0.27rem)
- **Border Radius**: sm, md, lg, xl variants
- **Breakpoints**: sm, md, lg, xl, 2xl (responsive)

### Effects
- **Shadows**: 2xs, xs, sm, md, lg, xl, 2xl
- **Animations**: Duration and easing tokens

## Product-Specific Tokens

### Ivy-Web
- OKLch color system for modern color spaces
- IBM Plex Mono font
- Shadcn UI semantic tokens
- Optimized for Next.js 15 + Tailwind 4.0

### Ivy-Framework
- Extended 20+ color palette with variants
- Geist font system
- 10-color chart palette
- Comprehensive typography scale
- Optimized for Vite + React 19

## Documentation

- [Getting Started](./docs/getting-started.md) - Detailed setup guide
- [Migration Guide](./docs/migration-guide.md) - Migrate from inline tokens
- [Token Reference](./docs/token-reference.md) - Complete token catalog

## Development

```bash
# Clone the repository
git clone git@github.com:Ivy-Interactive/Ivy-Design-System.git
cd Ivy-Design-System

# Install dependencies
npm install

# Build the package
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Clean build artifacts
npm run clean
```

## Project Structure

```
Ivy-Design-System/
├── tokens/              # Source of truth (JSON)
│   ├── core/           # Shared tokens
│   ├── products/       # Product-specific tokens
│   └── themes/         # Light/dark themes
├── scripts/            # Build tooling
├── dist/               # Generated outputs
│   ├── css/           # CSS variables
│   ├── tailwind/      # Tailwind configs
│   ├── js/            # JS/TS exports
│   └── tokens/        # Raw JSON
└── docs/              # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes to the JSON token files in `tokens/`
4. Run `npm run build` to generate outputs
5. Commit your changes: `git commit -m 'Add my feature'`
6. Push to the branch: `git push origin my-feature`
7. Submit a pull request

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes to token names or structure
- **Minor**: New tokens or non-breaking enhancements
- **Patch**: Bug fixes or documentation updates

## License

MIT © Ivy Interactive

## Publishing

This package is published to both npm and NuGet registries. See [PUBLISHING.md](./PUBLISHING.md) for details.

**Automated Publishing:**
- Push a version tag (e.g., `v1.0.0`) to trigger automatic publishing to both registries
- GitHub Actions handles building, testing, and publishing

**Manual Version Updates:**
```bash
npm run sync-version 1.0.1
git add package.json Ivy.DesignSystem.csproj
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push && git push --tags
```

## Links

- [GitHub Repository](https://github.com/Ivy-Interactive/Ivy-Design-System)
- [npm Package](https://www.npmjs.com/package/ivy-design-system)
- [NuGet Package](https://www.nuget.org/packages/Ivy.DesignSystem)
- [Issue Tracker](https://github.com/Ivy-Interactive/Ivy-Design-System/issues)

---

Made with ❤️ by the Ivy team
