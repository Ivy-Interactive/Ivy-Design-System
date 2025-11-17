import { writeFile } from "fs/promises";

/**
 * Converts token objects to CSS custom properties
 * Handles nested token structures recursively
 * Handles both direct color structure and theme structure (theme.dark.color, theme.light.color)
 */
function tokenToCSS(obj: any, prefix = ""): string {
  let css = "";

  // Handle theme structure (theme.dark.color or theme.light.color)
  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0]; // 'dark' or 'light'
    if (obj.theme[themeKey]?.color) {
      return tokenToCSS(
        obj.theme[themeKey].color,
        prefix ? `${prefix}-color` : "color"
      );
    }
  }

  // Handle direct color structure
  if (obj.color) {
    return tokenToCSS(obj.color, prefix ? `${prefix}-color` : "color");
  }

  // Extract tokens from current level
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      // Check if this is a token with a value property
      if ("value" in value && "type" in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        css += `  --${varName}: ${value.value};\n`;
      } else if (key !== "theme") {
        // Recursively process nested objects, skip theme key
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        css += tokenToCSS(value, newPrefix);
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
 */
export async function generateCSS(
  tokens: any,
  outputPath: string,
  isDark = false
) {
  const cssVars = tokenToCSS(tokens);

  let css: string;
  if (isDark) {
    css = `@layer base {\n  .dark {\n${cssVars}  }\n}\n`;
  } else {
    css = `@layer base {\n  :root {\n${cssVars}  }\n}\n`;
  }

  await writeFile(outputPath, css);
  console.log(`  ✓ ${outputPath}`);
}
