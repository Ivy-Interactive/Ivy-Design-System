# Ivy Design System - Color Tokens Demo

A simple Vite application that displays all color tokens from the Ivy Design System.

## Quick Start

From the root of the project:

```bash
npm run demo
```

This will:
1. Build the design system
2. Install demo dependencies
3. Start the Vite dev server

## Manual Setup

If you've already built the design system (`npm run build`), you can run just the demo:

```bash
cd demo
npm install
npm run dev
```

The demo will be available at http://localhost:3000

## Features

- Displays all source colors from the design system
- Shows chromatic (rainbow) colors and neutral colors
- Theme toggle button to switch between light and dark modes
- Each color swatch shows:
  - Color name
  - Hex value
  - CSS variable name

## How It Works

The demo imports CSS and tokens from the `@ivy-interactive/ivy-design-system` package:

```typescript
import '@ivy-interactive/ivy-design-system/css/ivy-framework-source'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-light'
import '@ivy-interactive/ivy-design-system/css/ivy-framework-dark'
import tokens from '@ivy-interactive/ivy-design-system/tokens'
```

All colors are rendered using CSS variables (e.g., `var(--color-primary)`), so they automatically update when the theme changes.
