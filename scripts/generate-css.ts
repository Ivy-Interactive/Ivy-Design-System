import { writeFile } from "fs/promises";

/**
 * Resolves token references like {ivy-framework.source.color.primary} or {ivy-framework.source.sizing.4} to actual values
 */
function resolveTokenReference(
  value: string,
  sourceTokens?: Record<string, any>
): string {
  if (!sourceTokens) return value;

  const referenceMatch = value.match(/^\{(ivy-framework|ivy-web)\.source\.(color|sizing)\.([\w.-]+)\}$/);
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
 * Converts token objects to CSS custom properties
 * Handles nested token structures recursively
 * Handles theme structure (theme.dark/light) and source structure (color, sizing)
 */
function tokenToCSS(obj: any, prefix = "", sourceTokens?: Record<string, any>): string {
  let css = "";

  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0];
    const themeObj = obj.theme[themeKey];
    if (themeObj) {
      for (const [category, tokens] of Object.entries(themeObj)) {
        if (typeof tokens === "object" && tokens !== null) {
          css += tokenToCSS(tokens, category, sourceTokens);
        }
      }
    }
    return css;
  }

  const categories = ["color", "sizing", "border-radius"];
  for (const category of categories) {
    if (obj[category]) {
      css += tokenToCSS(obj[category], category, sourceTokens);
    }
  }
  if (categories.some(c => obj[c])) {
    return css;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      if ("value" in value && "type" in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        const resolvedValue = resolveTokenReference(value.value as string, sourceTokens);
        css += `  --${varName}: ${resolvedValue};\n`;
      } else if (key !== "theme") {
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
