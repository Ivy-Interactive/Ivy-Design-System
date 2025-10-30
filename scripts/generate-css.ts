import { writeFile } from 'fs/promises';

/**
 * Converts token objects to CSS custom properties
 * Handles nested token structures recursively
 */
function tokenToCSS(obj: any, prefix = ''): string {
  let css = '';

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Check if this is a token with a value property
      if ('value' in value && 'type' in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        css += `  --${varName}: ${value.value};\n`;
      } else {
        // Recursively process nested objects
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
export async function generateCSS(tokens: any, outputPath: string, isDark = false) {
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
