# Token Reference

Complete catalog of all design tokens in Ivy Design System.

## Token Naming Convention

Tokens follow this naming pattern:

```
{category}-{subcategory}-{name}-{variant}
```

Examples:
- `color-brand-primary` - Brand primary color
- `color-semantic-text-primary` - Semantic text primary color
- `typography-fontSize-12` - Font size 12px
- `shadow-md` - Medium shadow

## Color Tokens

### Brand Colors

Core brand identity colors used across all products.

| Token | Value | Usage |
|-------|-------|-------|
| `color-brand-primary` | `#00cc92` | Primary brand color (teal) |
| `color-brand-primary-light` | `#00d18e` | Lighter variant of primary |
| `color-brand-primary-dark` | `#05986a` | Darker variant of primary |

#### Brand Teal Palette

| Token | Value | Preview |
|-------|-------|---------|
| `color-brand-teal-50` | `#f0fdf4` | Lightest teal |
| `color-brand-teal-100` | `#d4f6ed` | |
| `color-brand-teal-200` | `#ccf7ec` | |
| `color-brand-teal-300` | `#80e6c9` | |
| `color-brand-teal-400` | `#5be9c7` | |
| `color-brand-teal-500` | `#00d18e` | |
| `color-brand-teal-600` | `#00cc92` | Primary brand color |
| `color-brand-teal-700` | `#05986a` | |
| `color-brand-teal-800` | `#04694a` | |
| `color-brand-teal-900` | `#034a33` | Darkest teal |

#### Brand Mint Palette

| Token | Value | Usage |
|-------|-------|-------|
| `color-brand-mint-100` | `#ccf7ec` | Light mint accent |
| `color-brand-mint-200` | `#97f0d9` | Medium mint accent |
| `color-brand-mint-300` | `#5be9c7` | Dark mint accent |

### Semantic Colors (Ivy-Web)

Semantic color tokens for Shadcn UI components.

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `color-shadcn-background` | `hsla(180, 10%, 96%, 1)` | `#061109` | Page background |
| `color-shadcn-foreground` | `#061109` | `hsla(180, 10%, 96%, 1)` | Text color |
| `color-shadcn-card` | `#ffffff` | `#061109` | Card background |
| `color-shadcn-primary` | `oklch(0.75 0.16 164.07)` | `hsla(180, 10%, 96%, 1)` | Primary UI color |
| `color-shadcn-secondary` | `oklch(0.92 0.01 164.93)` | `oklch(0.27 0.01 286.03)` | Secondary UI color |
| `color-shadcn-muted` | `hsla(180, 10%, 96%, 1)` | `oklch(0.27 0.01 286.03)` | Muted backgrounds |
| `color-shadcn-accent` | `oklch(0.9 0.07 175.34)` | `oklch(0.27 0.01 286.03)` | Accent color |
| `color-shadcn-destructive` | `oklch(0.69 0.2 23.69)` | `oklch(0.4 0.13 25.72)` | Destructive actions |
| `color-shadcn-border` | `oklch(0.94 0 0)` | `oklch(0.27 0.01 286.03)` | Border color |
| `color-shadcn-input` | `oklch(0.94 0 0)` | `oklch(0.27 0.01 286.03)` | Input borders |
| `color-shadcn-ring` | `oklch(0.77 0 0)` | `oklch(0.87 0.01 286.29)` | Focus rings |

#### Surface Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-semantic-surface-primary` | `#ffffff` | Primary surface |
| `color-semantic-surface-secondary` | `#f8f9fa` | Secondary surface |
| `color-semantic-surface-tertiary` | `#f1f3f4` | Tertiary surface |
| `color-semantic-surface-elevated` | `#ffffff` | Elevated surface (cards, modals) |

#### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-semantic-text-primary` | `#061109` | Primary text |
| `color-semantic-text-secondary` | `#4c4c4c` | Secondary text |
| `color-semantic-text-tertiary` | `#787878` | Tertiary text |
| `color-semantic-text-muted` | `#9ca3af` | Muted text |
| `color-semantic-text-disabled` | `#d1d5db` | Disabled text |
| `color-semantic-text-inverse` | `#ffffff` | Inverse text (on dark bg) |
| `color-semantic-text-brand` | `#00cc92` | Brand-colored text |

#### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-semantic-border-primary` | `#e5e7eb` | Primary borders |
| `color-semantic-border-secondary` | `#d1d5db` | Secondary borders |
| `color-semantic-border-focus` | `#00cc92` | Focus state borders |
| `color-semantic-border-brand` | `#00cc92` | Brand borders |

#### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-semantic-status-success` | `#10b981` | Success messages |
| `color-semantic-status-warning` | `#f59e0b` | Warning messages |
| `color-semantic-status-error` | `#ef4444` | Error messages |
| `color-semantic-status-info` | `#3b82f6` | Info messages |

### Extended Color Palette (Ivy-Framework)

Full color palette with base, light, dark, and foreground variants.

#### Neutral Colors

| Color | Base | Foreground | Light | Dark |
|-------|------|------------|-------|------|
| Black | `#000000` | `#ffffff` | `#b5b5b5` | `#212221` |
| White | `#ffffff` | `#000000` | `#ffffff` | `#6b6c6b` |
| Slate | `#6a7489` | `#000000` | `#ced1d7` | `#393d43` |
| Gray | `#6e727f` | `#000000` | `#cfd0d4` | `#3a3d40` |
| Zinc | `#717179` | `#ffffff` | `#d0d0d3` | `#3b3c3f` |
| Neutral | `#737373` | `#ffffff` | `#d0d0d0` | `#3c3d3c` |
| Stone | `#76716d` | `#ffffff` | `#d1d0ce` | `#3d3c3a` |

#### Vibrant Colors

| Color | Base | Foreground | Light | Dark |
|-------|------|------------|-------|------|
| Red | `#dd5860` | `#000000` | `#efc5c9` | `#5d3235` |
| Orange | `#dc824d` | `#000000` | `#f1d4c1` | `#5e412e` |
| Amber | `#deb145` | `#000000` | `#f3e4ba` | `#605129` |
| Yellow | `#e5e04c` | `#000000` | `#f5f4b3` | `#626125` |
| Lime | `#afd953` | `#000000` | `#e3f2c0` | `#4f5f2e` |
| Green | `#86d26f` | `#000000` | `#d2efcd` | `#405d3a` |
| Emerald | `#76cd94` | `#000000` | `#c2eeda` | `#355a47` |
| Teal | `#5b9ba8` | `#000000` | `#bedde2` | `#2e4a4e` |
| Cyan | `#4469c0` | `#ffffff` | `#bacde9` | `#293a55` |
| Sky | `#373bda` | `#ffffff` | `#b8bcf1` | `#25295e` |
| Blue | `#381ff4` | `#ffffff` | `#b5acf9` | `#231a66` |
| Indigo | `#4b28e2` | `#ffffff` | `#c0b4f4` | `#2c2161` |
| Violet | `#6637d1` | `#ffffff` | `#cabbef` | `#36285b` |
| Purple | `#844cc0` | `#ffffff` | `#d4c2e9` | `#412f55` |
| Fuchsia | `#a361af` | `#000000` | `#dfc9e4` | `#4b3750` |
| Pink | `#c377a0` | `#000000` | `#ead1df` | `#563e4b` |
| Rose | `#e48e91` | `#000000` | `#f4d8da` | `#614647` |

**Usage**: Access via `color-palette-{color}-{variant}`
- Example: `color-palette-red-base`, `color-palette-blue-light`

### Chart Colors

10-color palette for data visualization.

| Token | Value | Usage |
|-------|-------|-------|
| `color-chart-1` | `#00cc92` | Primary chart color |
| `color-chart-2` | `#dd5860` | Secondary chart color |
| `color-chart-3` | `#373bda` | Tertiary chart color |
| `color-chart-4` | `#deb145` | Quaternary chart color |
| `color-chart-5` | `#844cc0` | Quinary chart color |
| `color-chart-6` | `#f3a43b` | Additional chart color |
| `color-chart-7` | `#91c7ae` | Additional chart color |
| `color-chart-8` | `#d48265` | Additional chart color |
| `color-chart-9` | `#749f83` | Additional chart color |
| `color-chart-10` | `#ca8622` | Additional chart color |

## Typography Tokens

### Font Families

| Token | Value | Product |
|-------|-------|---------|
| `typography-fontFamily-sans` | `Geist, system-ui, sans-serif` | Ivy-Framework |
| `typography-fontFamily-serif` | `Geist, system-ui, sans-serif` | Ivy-Framework |
| `typography-fontFamily-mono` | `Geist Mono, monospace` | Ivy-Framework |
| `typography-fontFamily-mono` | `IBM Plex Mono, monospace` | Ivy-Web |

### Font Sizes (Ivy-Framework)

| Token | Value | Usage |
|-------|-------|-------|
| `typography-fontSize-5` | `5px` | Tiny text |
| `typography-fontSize-8` | `8px` | Extra small |
| `typography-fontSize-10` | `10px` | Very small |
| `typography-fontSize-12` | `12px` | Small |
| `typography-fontSize-15` | `15px` | Base |
| `typography-fontSize-20` | `20px` | Medium |
| `typography-fontSize-25` | `25px` | Large |
| `typography-fontSize-30` | `30px` | Extra large |
| `typography-fontSize-40` | `40px` | Heading |
| `typography-fontSize-60` | `60px` | Hero |

### Line Heights (Ivy-Framework)

| Token | Value |
|-------|-------|
| `typography-lineHeight-12` | `12px` |
| `typography-lineHeight-13` | `13px` |
| `typography-lineHeight-14` | `14px` |
| `typography-lineHeight-15` | `15px` |
| `typography-lineHeight-16` | `16px` |
| `typography-lineHeight-22` | `22px` |
| `typography-lineHeight-24` | `24px` |
| `typography-lineHeight-27` | `27px` |
| `typography-lineHeight-32` | `32px` |
| `typography-lineHeight-41` | `41px` |
| `typography-lineHeight-60` | `60px` |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `typography-letterSpacing-neg-5` | `-5%` | Very tight |
| `typography-letterSpacing-neg-4` | `-4%` | Tight |
| `typography-letterSpacing-neg-3` | `-3%` | |
| `typography-letterSpacing-neg-2` | `-2%` | |
| `typography-letterSpacing-0` | `0%` | Normal |
| `typography-letterSpacing-1` | `1%` | |
| `typography-letterSpacing-2` | `2%` | |
| `typography-letterSpacing-4` | `4%` | Wide |
| `typography-letterSpacing-8` | `8%` | Extra wide |
| `typography-letterSpacing-14` | `14%` | Very wide |

### Tracking

| Token | Value | Usage |
|-------|-------|-------|
| `typography-tracking-normal` | `-0.025em` | Base tracking |
| `typography-tracking-tighter` | `-0.075em` | Tighter spacing |
| `typography-tracking-tight` | `-0.05em` | Tight spacing |
| `typography-tracking-wide` | `0em` | Wide spacing |
| `typography-tracking-wider` | `0.025em` | Wider spacing |
| `typography-tracking-widest` | `0.075em` | Widest spacing |

## Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-unit` | `0.27rem` | Base spacing unit |

**Usage**: Multiply for larger spacing:
```css
padding: calc(var(--spacing-unit) * 2); /* 2x spacing */
margin: calc(var(--spacing-unit) * 4);  /* 4x spacing */
```

## Border Tokens

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-base` | `0.5rem` | Base radius (8px) |
| `radius-sm` | `calc(0.5rem - 4px)` | Small radius (4px) |
| `radius-md` | `calc(0.5rem - 2px)` | Medium radius (6px) |
| `radius-lg` | `0.5rem` | Large radius (8px) |
| `radius-xl` | `calc(0.5rem + 4px)` | Extra large radius (12px) |

## Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-2xs` | `0 1px 3px 0px hsl(0 0% 0% / 0.05)` | Subtle shadow |
| `shadow-xs` | `0 1px 3px 0px hsl(0 0% 0% / 0.05)` | Extra small shadow |
| `shadow-sm` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)` | Small shadow |
| `shadow-md` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1)` | Medium shadow |
| `shadow-lg` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1)` | Large shadow |
| `shadow-xl` | `0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1)` | Extra large shadow |
| `shadow-2xl` | `0 1px 3px 0px hsl(0 0% 0% / 0.25)` | Huge shadow |

## Breakpoint Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `breakpoint-sm` | `640px` | Small screens |
| `breakpoint-md` | `768px` | Medium screens (tablets) |
| `breakpoint-lg` | `1024px` | Large screens (laptops) |
| `breakpoint-xl` | `1280px` | Extra large screens (desktops) |
| `breakpoint-2xl` | `1536px` | Extra extra large screens |

## Animation Tokens

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| `animation-duration-fast` | `150ms` | Fast animations |
| `animation-duration-normal` | `200ms` | Normal animations |
| `animation-duration-slow` | `300ms` | Slow animations |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `animation-easing-in` | `ease-in` | Ease in |
| `animation-easing-out` | `ease-out` | Ease out |
| `animation-easing-inOut` | `ease-in-out` | Ease in and out |

## Token Count Summary

- **Total tokens**: 260+
- **Color tokens**: 180+
- **Typography tokens**: 40+
- **Spacing tokens**: 1
- **Border tokens**: 5
- **Shadow tokens**: 7
- **Breakpoint tokens**: 5
- **Animation tokens**: 6

## Using Tokens

### In CSS

```css
.component {
  background-color: var(--color-brand-primary);
  color: var(--color-semantic-text-primary);
  font-family: var(--typography-fontFamily-mono);
  font-size: var(--typography-fontSize-15);
  padding: var(--spacing-unit);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### In Tailwind

```jsx
<div className="bg-color-brand-primary text-color-semantic-text-primary font-typography-fontFamily-mono text-typography-fontSize-15 p-spacing-unit rounded-radius-lg shadow-shadow-md">
  Content
</div>
```

### In JavaScript

```javascript
import { tokens } from 'ivy-design-system';

const styles = {
  backgroundColor: tokens['color-brand-primary'],
  color: tokens['color-semantic-text-primary'],
  fontFamily: tokens['typography-fontFamily-mono'],
};
```

## Contributing

To add new tokens:

1. Edit the JSON files in `tokens/`
2. Run `npm run build` to generate outputs
3. Test the new tokens
4. Submit a pull request

For questions or suggestions, [open an issue](https://github.com/Ivy-Interactive/Ivy-Design-System/issues).
