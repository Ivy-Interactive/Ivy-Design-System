import { writeFile } from "fs/promises";

/**
 * Resolves token references like {core.ivy-framework.source.color.primary} or {core.ivy-web.source.color.primary} to actual values
 */
function resolveTokenReference(
  value: string,
  sourceTokens?: Record<string, any>
): string {
  if (!sourceTokens) return value;
  
  // Check if it's a reference format: {core.ivy-framework.source.color.token-name} or {core.ivy-web.source.color.token-name}
  const referenceMatch = value.match(/^\{core\.(ivy-framework|ivy-web)\.source\.color\.([\w-]+)\}$/);
  if (referenceMatch) {
    const tokenName = referenceMatch[2];
    // Look up in source tokens
    if (sourceTokens.color && sourceTokens.color[tokenName]) {
      const sourceValue = sourceTokens.color[tokenName];
      if (typeof sourceValue === "object" && sourceValue !== null && "value" in sourceValue) {
        return sourceValue.value as string;
      } else if (typeof sourceValue === "string") {
        return sourceValue;
      }
    }
  }
  // If not a reference or not found, return as-is
  return value;
}

/**
 * Converts token objects to CSS custom properties
 * Handles nested token structures recursively
 * Handles both direct color structure and theme structure (theme.dark.color, theme.light.color)
 */
function tokenToCSS(obj: any, prefix = "", sourceTokens?: Record<string, any>): string {
  let css = "";

  // Handle theme structure (theme.dark.color or theme.light.color)
  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0]; // 'dark' or 'light'
    if (obj.theme[themeKey]?.color) {
      return tokenToCSS(
        obj.theme[themeKey].color,
        prefix ? `${prefix}-color` : "color",
        sourceTokens
      );
    }
  }

  // Handle direct color structure
  if (obj.color) {
    return tokenToCSS(obj.color, prefix ? `${prefix}-color` : "color", sourceTokens);
  }

  // Extract tokens from current level
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      // Check if this is a token with a value property
      if ("value" in value && "type" in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        const resolvedValue = resolveTokenReference(value.value as string, sourceTokens);
        css += `  --${varName}: ${resolvedValue};\n`;
      } else if (key !== "theme") {
        // Recursively process nested objects, skip theme key
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        css += tokenToCSS(value, newPrefix, sourceTokens);
      }
    }
  }

  return css;
}

/**
 * Generates CSS file with design tokens as custom properties
 * @param tokens - Token object to convert
 * @param outputPath - Output file path
 * @param isDark - Whether this is for dark mode (uses .dark selector)
 * @param sourceTokens - Source tokens for resolving references (optional)
 */
export async function generateCSS(
  tokens: any,
  outputPath: string,
  isDark = false,
  sourceTokens?: Record<string, any>
) {
  const cssVars = tokenToCSS(tokens, "", sourceTokens);

  let css: string;
  if (isDark) {
    css = `@layer base {\n  .dark {\n${cssVars}  }\n}\n`;
  } else {
    css = `@layer base {\n  :root {\n${cssVars}  }\n}\n`;
  }

  await writeFile(outputPath, css);
  console.log(`  ✓ ${outputPath}`);
}
