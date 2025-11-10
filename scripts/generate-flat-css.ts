import { writeFile } from 'fs/promises';

/**
 * Mapping from structured design system token names to flat frontend variable names
 * This ensures backwards compatibility with existing frontend CSS
 */
const TOKEN_MAPPING: Record<string, string> = {
  // UI Colors
  'color-ui-background-base': 'background',
  'color-ui-background-foreground': 'foreground',
  'color-ui-border': 'border',
  'color-ui-input': 'input',
  'color-ui-ring': 'ring',
  'color-ui-muted-base': 'muted',
  'color-ui-muted-foreground': 'muted-foreground',
  'color-ui-accent-base': 'accent',
  'color-ui-accent-foreground': 'accent-foreground',
  'color-ui-card-base': 'card',
  'color-ui-card-foreground': 'card-foreground',
  'color-ui-popover-base': 'popover',
  'color-ui-popover-foreground': 'popover-foreground',

  // Semantic Colors
  'color-semantic-primary-base': 'primary',
  'color-semantic-primary-foreground': 'primary-foreground',
  'color-semantic-secondary-base': 'secondary',
  'color-semantic-secondary-foreground': 'secondary-foreground',
  'color-semantic-destructive-base': 'destructive',
  'color-semantic-destructive-foreground': 'destructive-foreground',
  'color-semantic-success-base': 'success',
  'color-semantic-success-foreground': 'success-foreground',
  'color-semantic-warning-base': 'warning',
  'color-semantic-warning-foreground': 'warning-foreground',
  'color-semantic-info-base': 'info',
  'color-semantic-info-foreground': 'info-foreground',

  // Sidebar Colors
  'color-sidebar-base': 'sidebar',
  'color-sidebar-foreground': 'sidebar-foreground',

  // Color Palette
  'color-palette-black-base': 'black',
  'color-palette-black-foreground': 'black-foreground',
  'color-palette-white-base': 'white',
  'color-palette-white-foreground': 'white-foreground',
  'color-palette-slate-base': 'slate',
  'color-palette-slate-foreground': 'slate-foreground',
  'color-palette-gray-base': 'gray',
  'color-palette-gray-foreground': 'gray-foreground',
  'color-palette-zinc-base': 'zinc',
  'color-palette-zinc-foreground': 'zinc-foreground',
  'color-palette-neutral-base': 'neutral',
  'color-palette-neutral-foreground': 'neutral-foreground',
  'color-palette-stone-base': 'stone',
  'color-palette-stone-foreground': 'stone-foreground',
  'color-palette-red-base': 'red',
  'color-palette-red-foreground': 'red-foreground',
  'color-palette-orange-base': 'orange',
  'color-palette-orange-foreground': 'orange-foreground',
  'color-palette-amber-base': 'amber',
  'color-palette-amber-foreground': 'amber-foreground',
  'color-palette-yellow-base': 'yellow',
  'color-palette-yellow-foreground': 'yellow-foreground',
  'color-palette-lime-base': 'lime',
  'color-palette-lime-foreground': 'lime-foreground',
  'color-palette-green-base': 'green',
  'color-palette-green-foreground': 'green-foreground',
  'color-palette-emerald-base': 'emerald',
  'color-palette-emerald-foreground': 'emerald-foreground',
  'color-palette-teal-base': 'teal',
  'color-palette-teal-foreground': 'teal-foreground',
  'color-palette-cyan-base': 'cyan',
  'color-palette-cyan-foreground': 'cyan-foreground',
  'color-palette-sky-base': 'sky',
  'color-palette-sky-foreground': 'sky-foreground',
  'color-palette-blue-base': 'blue',
  'color-palette-blue-foreground': 'blue-foreground',
  'color-palette-indigo-base': 'indigo',
  'color-palette-indigo-foreground': 'indigo-foreground',
  'color-palette-violet-base': 'violet',
  'color-palette-violet-foreground': 'violet-foreground',
  'color-palette-purple-base': 'purple',
  'color-palette-purple-foreground': 'purple-foreground',
  'color-palette-fuchsia-base': 'fuchsia',
  'color-palette-fuchsia-foreground': 'fuchsia-foreground',
  'color-palette-pink-base': 'pink',
  'color-palette-pink-foreground': 'pink-foreground',
  'color-palette-rose-base': 'rose',
  'color-palette-rose-foreground': 'rose-foreground',

  // Chart Colors
  'color-chart-1': 'chart-1',
  'color-chart-2': 'chart-2',
  'color-chart-3': 'chart-3',
  'color-chart-4': 'chart-4',
  'color-chart-5': 'chart-5',
  'color-chart-6': 'chart-6',
  'color-chart-7': 'chart-7',
  'color-chart-8': 'chart-8',
  'color-chart-9': 'chart-9',
  'color-chart-10': 'chart-10',

  // Radius
  'radius-sm': 'radius-sm',
  'radius-md': 'radius-md',
  'radius-lg': 'radius-lg',
  'radius-xl': 'radius-xl',

  // Typography - Font Size
  'typography-font-size-60': 'font-size-60',
  'typography-font-size-40': 'font-size-40',
  'typography-font-size-30': 'font-size-30',
  'typography-font-size-25': 'font-size-25',
  'typography-font-size-20': 'font-size-20',
  'typography-font-size-15': 'font-size-15',
  'typography-font-size-12': 'font-size-12',
  'typography-font-size-10': 'font-size-10',
  'typography-font-size-8': 'font-size-8',
  'typography-font-size-5': 'font-size-5',

  // Typography - Line Height
  'typography-line-height-60': 'line-height-60',
  'typography-line-height-41': 'line-height-41',
  'typography-line-height-32': 'line-height-32',
  'typography-line-height-27': 'line-height-27',
  'typography-line-height-24': 'line-height-24',
  'typography-line-height-22': 'line-height-22',
  'typography-line-height-16': 'line-height-16',
  'typography-line-height-15': 'line-height-15',
  'typography-line-height-14': 'line-height-14',
  'typography-line-height-13': 'line-height-13',
  'typography-line-height-12': 'line-height-12',

  // Typography - Letter Spacing
  'typography-letter-spacing-neg-5': 'letter-spacing-neg-5',
  'typography-letter-spacing-neg-4': 'letter-spacing-neg-4',
  'typography-letter-spacing-neg-3': 'letter-spacing-neg-3',
  'typography-letter-spacing-neg-2': 'letter-spacing-neg-2',
  'typography-letter-spacing-0': 'letter-spacing-0',
  'typography-letter-spacing-1': 'letter-spacing-1',
  'typography-letter-spacing-2': 'letter-spacing-2',
  'typography-letter-spacing-4': 'letter-spacing-4',
  'typography-letter-spacing-8': 'letter-spacing-8',
  'typography-letter-spacing-14': 'letter-spacing-14',

  // Typography - Tracking
  'typography-tracking-normal': 'tracking-normal',
  'typography-tracking-tighter': 'tracking-tighter',
  'typography-tracking-tight': 'tracking-tight',
  'typography-tracking-wide': 'tracking-wide',
  'typography-tracking-wider': 'tracking-wider',
  'typography-tracking-widest': 'tracking-widest',
};

/**
 * Theme-specific token mappings for dark theme overrides
 */
const THEME_MAPPING: Record<string, string> = {
  'theme-dark-background': 'background',
  'theme-dark-foreground': 'foreground',
  'theme-dark-card': 'card',
  'theme-dark-card-foreground': 'card-foreground',
  'theme-dark-popover': 'popover',
  'theme-dark-popover-foreground': 'popover-foreground',
  'theme-dark-primary': 'primary',
  'theme-dark-primary-foreground': 'primary-foreground',
  'theme-dark-secondary': 'secondary',
  'theme-dark-secondary-foreground': 'secondary-foreground',
  'theme-dark-muted': 'muted',
  'theme-dark-muted-foreground': 'muted-foreground',
  'theme-dark-accent': 'accent',
  'theme-dark-accent-foreground': 'accent-foreground',
  'theme-dark-destructive': 'destructive',
  'theme-dark-destructive-foreground': 'destructive-foreground',
  'theme-dark-border': 'border',
  'theme-dark-input': 'input',
  'theme-dark-ring': 'ring',
  'theme-dark-sidebar': 'sidebar',
  'theme-dark-sidebar-foreground': 'sidebar-foreground',
};

/**
 * Converts token objects to flat CSS custom properties using mapping
 * Handles nested token structures recursively
 */
function tokenToFlatCSS(obj: any, prefix = '', mapping: Record<string, string>): string {
  let css = '';

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Check if this is a token with a value property
      if ('value' in value && 'type' in value) {
        const structuredName = prefix ? `${prefix}-${key}` : key;
        const flatName = mapping[structuredName];

        if (flatName) {
          css += `  --${flatName}: ${value.value};\n`;
        }
      } else {
        // Recursively process nested objects
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        css += tokenToFlatCSS(value, newPrefix, mapping);
      }
    }
  }

  return css;
}

/**
 * Generates flat CSS file with design tokens using frontend-compatible variable names
 * @param tokens - Token object to convert
 * @param outputPath - Output file path
 * @param isDark - Whether this is for dark mode (uses .dark selector)
 */
export async function generateFlatCSS(tokens: any, outputPath: string, isDark = false) {
  const mapping = isDark ? THEME_MAPPING : TOKEN_MAPPING;
  const cssVars = tokenToFlatCSS(tokens, '', mapping);

  let css: string;
  if (isDark) {
    css = `@layer base {\n  .dark {\n${cssVars}  }\n}\n`;
  } else {
    css = `@layer base {\n  :root {\n${cssVars}  }\n}\n`;
  }

  await writeFile(outputPath, css);
  console.log(`  ✓ ${outputPath} (flat)`);
}
