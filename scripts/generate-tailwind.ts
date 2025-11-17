import { writeFile } from "fs/promises";

/**
 * Converts token objects to Tailwind theme configuration
 * Maps tokens to CSS variable references
 */
function tokenToTailwind(obj: any, prefix = ""): any {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      // Check if this is a token with a value property
      if ("value" in value && "type" in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        result[key] = `var(--${varName})`;
      } else {
        // Recursively process nested objects
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        result[key] = tokenToTailwind(value, newPrefix);
      }
    }
  }

  return result;
}

/**
 * Maps token categories to Tailwind theme keys
 * Only handles colors in the simplified structure
 */
function mapTokensToTailwindTheme(tokens: any): any {
  const theme: any = {};

  // Map colors - handle both direct color structure and nested structure
  if (tokens.color) {
    theme.colors = tokenToTailwind(tokens.color, "color");
  }

  return theme;
}

/**
 * Generates Tailwind configuration file
 * @param tokens - Token object to convert
 * @param outputPath - Output file path
 */
export async function generateTailwind(tokens: any, outputPath: string) {
  const theme = mapTokensToTailwindTheme(tokens);

  const config = {
    theme: {
      extend: theme,
    },
  };

  const content = `export default ${JSON.stringify(config, null, 2)};\n`;
  await writeFile(outputPath, content);
  console.log(`  ✓ ${outputPath}`);
}
