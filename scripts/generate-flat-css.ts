import { writeFile } from "fs/promises";

/**
 * Mapping from simplified token names to flat frontend variable names
 * Tokens are already simplified (e.g., 'primary', 'primary-foreground')
 */
const TOKEN_MAPPING: Record<string, string> = {
  // Semantic Colors
  "color-primary": "primary",
  "color-primary-foreground": "primary-foreground",
  "color-secondary": "secondary",
  "color-secondary-foreground": "secondary-foreground",
  "color-destructive": "destructive",
  "color-destructive-foreground": "destructive-foreground",
  "color-success": "success",
  "color-success-foreground": "success-foreground",
  "color-warning": "warning",
  "color-warning-foreground": "warning-foreground",
  "color-info": "info",
  "color-info-foreground": "info-foreground",

  // UI Colors
  "color-background": "background",
  "color-foreground": "foreground",
  "color-border": "border",
  "color-input": "input",
  "color-ring": "ring",
  "color-muted": "muted",
  "color-muted-foreground": "muted-foreground",
  "color-accent": "accent",
  "color-accent-foreground": "accent-foreground",
  "color-card": "card",
  "color-card-foreground": "card-foreground",
  "color-popover": "popover",
  "color-popover-foreground": "popover-foreground",
};

/**
 * Theme-specific token mappings for dark theme overrides
 */
const THEME_MAPPING: Record<string, string> = {
  "theme-dark-color-primary": "primary",
  "theme-dark-color-primary-foreground": "primary-foreground",
  "theme-dark-color-secondary": "secondary",
  "theme-dark-color-secondary-foreground": "secondary-foreground",
  "theme-dark-color-destructive": "destructive",
  "theme-dark-color-destructive-foreground": "destructive-foreground",
  "theme-dark-color-success": "success",
  "theme-dark-color-success-foreground": "success-foreground",
  "theme-dark-color-warning": "warning",
  "theme-dark-color-warning-foreground": "warning-foreground",
  "theme-dark-color-info": "info",
  "theme-dark-color-info-foreground": "info-foreground",
  "theme-dark-color-background": "background",
  "theme-dark-color-foreground": "foreground",
  "theme-dark-color-border": "border",
  "theme-dark-color-input": "input",
  "theme-dark-color-ring": "ring",
  "theme-dark-color-muted": "muted",
  "theme-dark-color-muted-foreground": "muted-foreground",
  "theme-dark-color-accent": "accent",
  "theme-dark-color-accent-foreground": "accent-foreground",
  "theme-dark-color-card": "card",
  "theme-dark-color-card-foreground": "card-foreground",
  "theme-dark-color-popover": "popover",
  "theme-dark-color-popover-foreground": "popover-foreground",
};

/**
 * Converts token objects to flat CSS custom properties using mapping
 * Handles nested token structures recursively
 * Handles both direct color structure and theme structure (theme.dark.color, theme.light.color)
 */
function tokenToFlatCSS(
  obj: any,
  prefix = "",
  mapping: Record<string, string>
): string {
  let css = "";

  // Handle theme structure (theme.dark.color or theme.light.color)
  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0]; // 'dark' or 'light'
    if (obj.theme[themeKey]?.color) {
      return tokenToFlatCSS(
        obj.theme[themeKey].color,
        `theme-${themeKey}-color`,
        mapping
      );
    }
  }

  // Handle direct color structure
  if (obj.color) {
    return tokenToFlatCSS(obj.color, "color", mapping);
  }

  // Extract tokens from current level
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      // Check if this is a token with a value property
      if ("value" in value && "type" in value) {
        const structuredName = prefix ? `${prefix}-${key}` : key;
        const flatName = mapping[structuredName] || key;

        css += `  --${flatName}: ${value.value};\n`;
      } else if (key !== "theme") {
        // Recursively process nested objects, skip theme key
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
export async function generateFlatCSS(
  tokens: any,
  outputPath: string,
  isDark = false
) {
  const mapping = isDark ? THEME_MAPPING : TOKEN_MAPPING;
  const cssVars = tokenToFlatCSS(tokens, "", mapping);

  let css: string;
  if (isDark) {
    css = `@layer base {\n  .dark {\n${cssVars}  }\n}\n`;
  } else {
    css = `@layer base {\n  :root {\n${cssVars}  }\n}\n`;
  }

  await writeFile(outputPath, css);
  console.log(`  ✓ ${outputPath} (flat)`);
}
