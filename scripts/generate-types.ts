import { writeFile } from 'fs/promises';

/**
 * Extracts all token names from nested token structure
 */
function extractTokenNames(obj: any, prefix = ''): string[] {
  const names: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      if ('value' in value && 'type' in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        names.push(varName);
      } else {
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        names.push(...extractTokenNames(value, newPrefix));
      }
    }
  }

  return names;
}

/**
 * Generates TypeScript type definitions and JavaScript token exports
 * @param tokens - All tokens object
 */
export async function generateTypes(tokens: any) {
  const tokenNames = extractTokenNames(tokens);

  // Generate TypeScript definitions
  const types = `/**
 * Design token names from Ivy Design System
 * Autocomplete-friendly type for accessing design tokens
 */
export type TokenName = ${tokenNames.map(n => `\n  | '${n}'`).join('')};

/**
 * All design tokens as a key-value map
 * Keys are token names, values are CSS variable references
 */
export const tokens: Record<TokenName, string>;

/**
 * Default export with all tokens
 */
export default tokens;
`;

  await writeFile('dist/js/index.d.ts', types);

  // Generate JavaScript module
  const tokensObj = Object.fromEntries(
    tokenNames.map(n => [n, `var(--${n})`])
  );

  const js = `/**
 * Ivy Design System - Design Tokens
 * Auto-generated token exports
 */
export const tokens = ${JSON.stringify(tokensObj, null, 2)};

export default tokens;
`;

  await writeFile('dist/js/index.js', js);

  console.log(`  ✓ dist/js/index.js`);
  console.log(`  ✓ dist/js/index.d.ts`);
  console.log(`  → Generated ${tokenNames.length} token exports`);
}
