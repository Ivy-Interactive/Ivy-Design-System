# Ivy Design System

Color tokens for Ivy-Framework with light and dark theme support.

## Installation

**npm**

```bash
npm install ivy-design-system
```

**.NET**

```bash
dotnet add package Ivy.DesignSystem
```

## Usage

### CSS

```css
@import "ivy-design-system/css/ivy-framework";
@import "ivy-design-system/css/light";

.button {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}
```

### Tailwind

```javascript
import ivyTokens from "ivy-design-system/tailwind/ivy-framework";

export default {
  ...ivyTokens,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
};
```

### TypeScript

```typescript
import { tokens } from "ivy-design-system";

const primary = tokens["color-primary"];
```

### C#

```csharp
using Ivy.Themes;

var primary = IvyFrameworkTokens.Color.Primary;
var background = LightThemeTokens.Color.Background;
```

## Tokens

- **Semantic**: primary, secondary, destructive, success, warning, info
- **UI**: background, foreground, border, input, ring, muted, accent, card, popover
- All tokens include foreground variants
- Light and dark theme support

Tokens are defined in `figma-tokens/$tokens.json` and exported to CSS, Tailwind, TypeScript, and C#.

## Development

```bash
npm install
npm run build
```

## Links

- [GitHub](https://github.com/Ivy-Interactive/Ivy-Design-System)
- [npm](https://www.npmjs.com/package/ivy-design-system)
- [NuGet](https://www.nuget.org/packages/Ivy.DesignSystem)

MIT © Ivy Interactive
