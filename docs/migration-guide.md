# Migration Guide

This guide helps you migrate from inline CSS variables to Ivy Design System tokens.

## Overview

The migration process involves:
1. Installing the design system package
2. Importing design system CSS/config
3. Gradually replacing inline tokens with design system tokens
4. Removing old token definitions

## Migration Strategy

We recommend a **gradual migration** approach:
- Start with new features using design tokens
- Migrate existing code incrementally
- Keep old and new tokens side-by-side during transition
- Remove old tokens once all references are updated

## Ivy-Web Migration

### Current State

Ivy-Web currently has tokens defined in:
- `/Users/joel/ivy/Ivy-Web/apps/web/styles/shadcn-ui.css`
- `/Users/joel/ivy/Ivy-Web/apps/web/styles/theme.css`

### Step 1: Install Design System

```bash
cd Ivy-Web
pnpm add ivy-design-system
```

### Step 2: Import Design System Tokens

Update `apps/web/app/global.css` or equivalent:

```css
/* Add at the top */
@import 'ivy-design-system/css/ivy-web';
@import 'ivy-design-system/css/light';

/* Keep existing imports for now */
@import '../styles/shadcn-ui.css';
@import '../styles/theme.css';
```

### Step 3: Token Mapping

Here's how Ivy-Web tokens map to design system tokens:

#### Brand Colors

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--color-brand-primary` | `--color-brand-primary` | ✅ Same name |
| `--color-brand-teal-600` | `--color-brand-teal-600` | ✅ Same name |
| `--custom-teal-600` | `--color-brand-teal-600` | ⚠️ Renamed |
| `--custom-mint-100` | `--color-brand-mint-100` | ⚠️ Renamed |

#### Shadcn Tokens

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--background` | `--color-shadcn-background` | ⚠️ Prefixed |
| `--foreground` | `--color-shadcn-foreground` | ⚠️ Prefixed |
| `--primary` | `--color-shadcn-primary` | ⚠️ Prefixed |
| `--secondary` | `--color-shadcn-secondary` | ⚠️ Prefixed |
| `--border` | `--color-shadcn-border` | ⚠️ Prefixed |
| `--ring` | `--color-shadcn-ring` | ⚠️ Prefixed |

#### Semantic Colors

| Old Token | New Token |
|-----------|-----------|
| `--color-surface-primary` | `--color-semantic-surface-primary` |
| `--color-text-primary` | `--color-semantic-text-primary` |
| `--color-border-primary` | `--color-semantic-border-primary` |
| `--color-success` | `--color-semantic-status-success` |

#### Effects

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--shadow-md` | `--shadow-md` | ✅ Same name |
| `--radius` | `--radius-base` | ⚠️ Renamed |
| `--radius-lg` | `--radius-lg` | ✅ Same name |

### Step 4: Update Components

#### Option A: Update CSS Files

Find and replace old tokens with new ones:

```css
/* Before */
.component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* After */
.component {
  background: var(--color-shadcn-background);
  color: var(--color-shadcn-foreground);
  border: 1px solid var(--color-shadcn-border);
}
```

#### Option B: Add Compatibility Layer

Create a temporary compatibility file that maps old names to new names:

```css
/* apps/web/styles/compat.css */
@layer base {
  :root {
    /* Map old Shadcn tokens to new prefixed tokens */
    --background: var(--color-shadcn-background);
    --foreground: var(--color-shadcn-foreground);
    --primary: var(--color-shadcn-primary);
    --secondary: var(--color-shadcn-secondary);
    --border: var(--color-shadcn-border);
    /* Add other mappings as needed */
  }
}
```

Import after design system tokens:

```css
@import 'ivy-design-system/css/ivy-web';
@import 'ivy-design-system/css/light';
@import './styles/compat.css'; /* Compatibility layer */
```

### Step 5: Update Tailwind Config

If using Tailwind, update your config:

```javascript
// Before
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-teal-600': '#00cc92',
        // ... more colors
      }
    }
  }
} satisfies Config;

// After
import ivyWebTokens from 'ivy-design-system/tailwind/ivy-web';

export default {
  ...ivyWebTokens,
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  // Your custom overrides
} satisfies Config;
```

### Step 6: Remove Old Tokens

Once all references are updated:

1. Remove or comment out `shadcn-ui.css` imports
2. Remove or comment out `theme.css` imports
3. Remove the compatibility layer
4. Delete old CSS files (optional, keep for reference)

## Ivy-Framework Migration

### Current State

Ivy-Framework currently has tokens defined in:
- `/Users/joel/ivy/Ivy-Framework/frontend/src/index.css`

### Step 1: Install Design System

```bash
cd Ivy-Framework/frontend
npm install ivy-design-system
```

### Step 2: Import Design System Tokens

Update `frontend/src/index.css`:

```css
@import 'tailwindcss';

/* Add design system tokens */
@import 'ivy-design-system/css/ivy-framework';
@import 'ivy-design-system/css/light';

/* Keep existing token definitions for now */
@layer base {
  :root {
    /* Old tokens - to be removed later */
  }
}
```

### Step 3: Token Mapping

Here's how Ivy-Framework tokens map to design system tokens:

#### Color Palette

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--primary` | `--color-semantic-primary-base` | ⚠️ Renamed |
| `--secondary` | `--color-semantic-secondary-base` | ⚠️ Renamed |
| `--destructive` | `--color-semantic-destructive-base` | ⚠️ Renamed |
| `--red` | `--color-palette-red-base` | ⚠️ Renamed |
| `--blue` | `--color-palette-blue-base` | ⚠️ Renamed |
| `--green` | `--color-palette-green-base` | ⚠️ Renamed |

#### Typography

| Old Token | New Token |
|-----------|-----------|
| `--font-sans` | `--typography-fontFamily-sans` |
| `--font-mono` | `--typography-fontFamily-mono` |
| `--font-size-12` | `--typography-fontSize-12` |
| `--line-height-16` | `--typography-lineHeight-16` |
| `--letter-spacing-2` | `--typography-letterSpacing-2` |

#### Charts

| Old Token | New Token |
|-----------|-----------|
| `--chart-1` | `--color-chart-1` |
| `--chart-2` | `--color-chart-2` |
| ... | ... |
| `--chart-10` | `--color-chart-10` |

### Step 4: Update Components

```tsx
// Before
function DataTable() {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-12)',
      lineHeight: 'var(--line-height-16)',
      backgroundColor: 'var(--primary)',
    }}>
      Data Table
    </div>
  );
}

// After
function DataTable() {
  return (
    <div style={{
      fontFamily: 'var(--typography-fontFamily-mono)',
      fontSize: 'var(--typography-fontSize-12)',
      lineHeight: 'var(--typography-lineHeight-16)',
      backgroundColor: 'var(--color-semantic-primary-base)',
    }}>
      Data Table
    </div>
  );
}
```

### Step 5: Update Tailwind Config

```javascript
// Before
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00cc92',
        // ... more colors
      }
    }
  }
};

// After
import ivyFrameworkTokens from 'ivy-design-system/tailwind/ivy-framework';

export default {
  ...ivyFrameworkTokens,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### Step 6: Remove Old Tokens

Once migration is complete:

1. Remove old token definitions from `index.css`
2. Keep only the design system imports
3. Update any hardcoded values to use tokens

## Testing Your Migration

### Visual Regression Testing

1. Take screenshots before migration
2. Complete migration
3. Take screenshots after migration
4. Compare to ensure no visual changes

### Token Usage Audit

Search your codebase for old token usage:

```bash
# Search for old Shadcn tokens (Ivy-Web)
grep -r "var(--background)" apps/web/
grep -r "var(--foreground)" apps/web/

# Search for old custom tokens
grep -r "var(--custom-teal" apps/web/
grep -r "var(--font-sans)" frontend/src/

# Search for old color references
grep -r "var(--primary)" frontend/src/
```

### Validate Token Values

Create a test page that displays all tokens side-by-side:

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div>
    <h3>Old Token</h3>
    <div style="background: var(--background);">Background</div>
  </div>
  <div>
    <h3>New Token</h3>
    <div style="background: var(--color-shadcn-background);">Background</div>
  </div>
</div>
```

## Breaking Changes

### Token Name Changes

Some tokens have been renamed for consistency:

- **Shadcn tokens** now have `color-shadcn-` prefix
- **Semantic tokens** now have `color-semantic-` prefix
- **Typography tokens** now have `typography-` prefix
- **Base radius** renamed from `--radius` to `--radius-base`

### Token Structure Changes

- Colors are now organized by category (brand, palette, semantic, shadcn)
- Typography tokens are grouped under `typography-fontFamily-*`, `typography-fontSize-*`, etc.

### Removed Tokens

The following legacy tokens have been removed:

- `--background-green-dark` → Use `--color-legacy-background-green-dark`
- `--gray-text` → Use `--color-legacy-gray-text`

## Rollback Plan

If you need to rollback:

1. Remove design system imports:
```css
/* Remove these lines */
@import 'ivy-design-system/css/ivy-web';
@import 'ivy-design-system/css/light';
```

2. Restore old token files
3. Revert component changes
4. Uninstall package: `npm uninstall ivy-design-system`

## Support

Need help with migration?

- Check the [Getting Started Guide](./getting-started.md)
- Review the [Token Reference](./token-reference.md)
- Open an issue on [GitHub](https://github.com/Ivy-Interactive/Ivy-Design-System/issues)
