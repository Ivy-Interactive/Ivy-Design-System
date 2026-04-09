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
  "theme-dark-border-radius-none": "radius-none",
  "theme-dark-border-radius-sm": "radius-sm",
  "theme-dark-border-radius-md": "radius",
  "theme-dark-border-radius-lg": "radius-lg",
  "theme-dark-border-radius-xl": "radius-xl",
  "theme-dark-border-radius-2xl": "radius-2xl",
  "theme-dark-border-radius-3xl": "radius-3xl",
  "theme-dark-border-radius-full": "radius-full",
};

/**
 * Resolves token references like {ivy-framework.source.color.primary} or {ivy-framework.source.sizing.4} to actual values
 */
function resolveTokenReference(
  value: string,
  sourceTokens?: Record<string, any>
): string {
  if (!sourceTokens) return value;

  const referenceMatch = value.match(/^\{(ivy-framework|ivy-web)\.source\.(color|sizing|shadow)\.([\w.-]+)\}$/);
  if (referenceMatch) {
    const category = referenceMatch[2];
    const tokenName = referenceMatch[3];
    if (sourceTokens[category] && sourceTokens[category][tokenName]) {
      const sourceValue = sourceTokens[category][tokenName];
      if (typeof sourceValue === "object" && sourceValue !== null && "value" in sourceValue) {
        return sourceValue.value as string;
      } else if (typeof sourceValue === "string") {
        return sourceValue;
      }
    }
  }
  return value;
}

/**
 * Converts token objects to flat CSS custom properties using mapping
 * Handles nested token structures recursively
 * Handles theme structure and multiple token categories
 */
function tokenToFlatCSS(
  obj: any,
  prefix = "",
  mapping: Record<string, string>,
  sourceTokens?: Record<string, any>
): string {
  let css = "";

  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0];
    const themeObj = obj.theme[themeKey];
    if (themeObj) {
      for (const [category, tokens] of Object.entries(themeObj)) {
        if (typeof tokens === "object" && tokens !== null) {
          css += tokenToFlatCSS(tokens, `theme-${themeKey}-${category}`, mapping, sourceTokens);
        }
      }
    }
    return css;
  }

  const categories = ["color", "sizing", "border-radius", "padding", "shadow"];
  for (const category of categories) {
    if (obj[category]) {
      css += tokenToFlatCSS(obj[category], category, mapping, sourceTokens);
    }
  }
  if (categories.some(c => obj[c])) {
    return css;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      if ("value" in value && "type" in value) {
        const structuredName = prefix ? `${prefix}-${key}` : key;
        const flatName = mapping[structuredName] || key;
        const resolvedValue = resolveTokenReference(value.value as string, sourceTokens);
        css += `  --${flatName}: ${resolvedValue};\n`;
      } else if (key !== "theme") {
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        css += tokenToFlatCSS(value, newPrefix, mapping, sourceTokens);
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
  isDark = false,
  sourceTokens?: Record<string, any>
) {
  const mapping = isDark ? { ...TOKEN_MAPPING, ...THEME_MAPPING } : TOKEN_MAPPING;
  const cssVars = tokenToFlatCSS(tokens, "", mapping, sourceTokens);

  let css: string;
  if (isDark) {
    css = `@layer base {\n  .dark {\n${cssVars}  }\n}\n`;
  } else {
    css = `@layer base {\n  :root {\n${cssVars}  }\n}\n`;
  }

  await writeFile(outputPath, css);
  console.log(`  ✓ ${outputPath} (flat)`);
}
