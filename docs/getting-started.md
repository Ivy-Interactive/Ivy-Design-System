# Getting Started with Ivy Design System

This guide will help you integrate Ivy Design System into your project.

## Prerequisites

- Node.js 18+
- npm or pnpm package manager
- A project using CSS, Tailwind, or JavaScript/TypeScript

## Installation

### For Ivy-Web (Next.js + Turborepo)

```bash
cd Ivy-Web
pnpm add ivy-design-system
```

### For Ivy-Framework (Vite + React)

```bash
cd Ivy-Framework/frontend
npm install ivy-design-system
```

## Integration Methods

Choose the integration method that best fits your workflow:

### Method 1: CSS Variables (Recommended for CSS-first projects)

This method imports design tokens as CSS custom properties.

#### Ivy-Web Setup

1. Open your global CSS file (e.g., `apps/web/app/global.css`):

```css
/* Import Ivy-Web tokens */
@import 'ivy-design-system/css/ivy-web';

/* Import theme (light or dark) */
@import 'ivy-design-system/css/light';

/* Your existing styles */
```

2. For dark mode support, use conditional imports or CSS classes:

```css
/* Light mode (default) */
@import 'ivy-design-system/css/light';

/* Dark mode - layer on top */
@media (prefers-color-scheme: dark) {
  @import 'ivy-design-system/css/dark';
}
```

3. Use tokens in your components:

```css
.hero-section {
  background-color: var(--color-brand-primary);
  color: var(--color-text-inverse);
  padding: calc(var(--spacing-unit) * 4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}
```

#### Ivy-Framework Setup

1. Open `frontend/src/index.css`:

```css
@import 'tailwindcss';

/* Import Ivy-Framework tokens */
@import 'ivy-design-system/css/ivy-framework';
@import 'ivy-design-system/css/light';

/* Your existing styles */
```

2. Use tokens in your components:

```css
.data-table {
  font-family: var(--typography-fontFamily-mono);
  font-size: var(--typography-fontSize-12);
  line-height: var(--typography-lineHeight-16);
  background: var(--color-semantic-surface-primary);
  border: 1px solid var(--color-semantic-border-primary);
}
```

### Method 2: Tailwind Configuration (Recommended for Tailwind projects)

This method extends your Tailwind config with design tokens.

#### Ivy-Web Tailwind Setup

If Ivy-Web uses a Tailwind config file, update it:

```javascript
// tailwind.config.js or apps/web/tailwind.config.ts
import ivyWebTokens from 'ivy-design-system/tailwind/ivy-web';

export default {
  // Spread Ivy tokens first
  ...ivyWebTokens,

  // Your project-specific config
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  // Override or extend as needed
  theme: {
    extend: {
      ...ivyWebTokens.theme.extend,
      // Your custom additions
    }
  },

  plugins: [],
};
```

#### Ivy-Framework Tailwind Setup

If Ivy-Framework uses Tailwind 3.x, create or update the config:

```javascript
// frontend/tailwind.config.js
import ivyFrameworkTokens from 'ivy-design-system/tailwind/ivy-framework';

export default {
  ...ivyFrameworkTokens,

  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  plugins: [],
};
```

Then use tokens in your JSX:

```jsx
function DataTableHeader() {
  return (
    <div className="bg-color-semantic-primary-base text-color-semantic-primary-foreground px-spacing-unit py-2 rounded-radius-md shadow-shadow-sm">
      <h2 className="font-typography-fontFamily-mono text-typography-fontSize-15">
        Data Table
      </h2>
    </div>
  );
}
```

### Method 3: JavaScript/TypeScript (Recommended for JS-first projects)

Import tokens directly in your JavaScript/TypeScript code:

```typescript
import { tokens } from 'ivy-design-system';
import type { TokenName } from 'ivy-design-system';

// Use in inline styles
const styles = {
  backgroundColor: tokens['color-brand-primary'],
  padding: tokens['spacing-unit'],
  borderRadius: tokens['radius-lg'],
  boxShadow: tokens['shadow-md'],
};

// With React
function Button({ children }) {
  return (
    <button style={styles}>
      {children}
    </button>
  );
}

// With styled-components or emotion
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${tokens['color-brand-primary']};
  padding: ${tokens['spacing-unit']};
  border-radius: ${tokens['radius-lg']};
  box-shadow: ${tokens['shadow-md']};

  &:hover {
    background-color: ${tokens['color-brand-primary-light']};
  }
`;
```

### Method 4: Hybrid Approach (Best of all worlds)

Combine methods for maximum flexibility:

```css
/* Import CSS variables for global styles */
@import 'ivy-design-system/css/ivy-web';
```

```javascript
// tailwind.config.js - Use Tailwind for utility classes
import ivyTokens from 'ivy-design-system/tailwind/ivy-web';
export default ivyTokens;
```

```typescript
// Import JS tokens for dynamic styles
import { tokens } from 'ivy-design-system';

const dynamicColor = isActive ? tokens['color-brand-primary'] : tokens['color-semantic-secondary-base'];
```

## Verifying Installation

Create a test component to verify tokens are working:

### CSS Test

```css
.token-test {
  background: var(--color-brand-primary);
  color: white;
  padding: var(--spacing-unit);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

```html
<div class="token-test">
  Design tokens are working! ✅
</div>
```

### Tailwind Test

```jsx
<div className="bg-color-brand-primary text-white p-spacing-unit rounded-radius-lg shadow-shadow-md">
  Design tokens are working! ✅
</div>
```

### JavaScript Test

```javascript
import { tokens } from 'ivy-design-system';

console.log('Primary brand color:', tokens['color-brand-primary']);
// Expected: "var(--color-brand-primary)"
```

## Next Steps

- Read the [Token Reference](./token-reference.md) to explore all available tokens
- Check the [Migration Guide](./migration-guide.md) if you're replacing existing tokens
- Browse the `examples/` folder for integration examples

## Troubleshooting

### Tokens not found

**Problem**: CSS variables showing `var(--token-name)` instead of actual values.

**Solution**: Make sure you've imported the CSS file:
```css
@import 'ivy-design-system/css/ivy-web'; /* or ivy-framework */
```

### Tailwind classes not working

**Problem**: Tailwind classes like `bg-color-brand-primary` not applying styles.

**Solution**:
1. Ensure you've imported the Tailwind config
2. Rebuild your Tailwind CSS: `npm run build` or restart dev server
3. Check that the token names match exactly (case-sensitive)

### TypeScript errors

**Problem**: TypeScript complaining about token names.

**Solution**:
1. Make sure you have the latest version: `npm update ivy-design-system`
2. Restart your TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")
3. Check that you're importing the type correctly: `import type { TokenName } from 'ivy-design-system'`

### Dark mode not working

**Problem**: Dark mode tokens not applying.

**Solution**:
1. Import the dark theme CSS: `@import 'ivy-design-system/css/dark'`
2. Ensure your dark mode selector matches (`.dark` class or `prefers-color-scheme`)
3. For CSS variables, dark mode uses the `.dark` class selector

## Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/Ivy-Interactive/Ivy-Design-System/issues)
2. Review the examples in the `examples/` folder
3. Open a new issue with your question or bug report
