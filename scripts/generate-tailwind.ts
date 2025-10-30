import { writeFile } from 'fs/promises';

/**
 * Converts token objects to Tailwind theme configuration
 * Maps tokens to CSS variable references
 */
function tokenToTailwind(obj: any, prefix = ''): any {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Check if this is a token with a value property
      if ('value' in value && 'type' in value) {
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
 */
function mapTokensToTailwindTheme(tokens: any): any {
  const theme: any = {};

  // Map colors
  if (tokens.color) {
    theme.colors = tokenToTailwind(tokens.color, 'color');
  }

  // Map typography
  if (tokens.typography) {
    if (tokens.typography.fontFamily) {
      theme.fontFamily = tokenToTailwind(tokens.typography.fontFamily, 'typography-fontFamily');
    }
    if (tokens.typography.fontSize) {
      theme.fontSize = tokenToTailwind(tokens.typography.fontSize, 'typography-fontSize');
    }
    if (tokens.typography.lineHeight) {
      theme.lineHeight = tokenToTailwind(tokens.typography.lineHeight, 'typography-lineHeight');
    }
    if (tokens.typography.letterSpacing) {
      theme.letterSpacing = tokenToTailwind(tokens.typography.letterSpacing, 'typography-letterSpacing');
    }
    if (tokens.typography.tracking) {
      if (!theme.letterSpacing) theme.letterSpacing = {};
      Object.assign(theme.letterSpacing, tokenToTailwind(tokens.typography.tracking, 'typography-tracking'));
    }
  }

  // Map spacing
  if (tokens.spacing) {
    theme.spacing = tokenToTailwind(tokens.spacing, 'spacing');
  }

  // Map borders
  if (tokens.radius) {
    theme.borderRadius = tokenToTailwind(tokens.radius, 'radius');
  }

  // Map shadows
  if (tokens.shadow) {
    theme.boxShadow = tokenToTailwind(tokens.shadow, 'shadow');
  }

  // Map breakpoints
  if (tokens.breakpoint) {
    theme.screens = tokenToTailwind(tokens.breakpoint, 'breakpoint');
  }

  // Map animations
  if (tokens.animation) {
    if (tokens.animation.duration) {
      theme.transitionDuration = tokenToTailwind(tokens.animation.duration, 'animation-duration');
    }
    if (tokens.animation.easing) {
      theme.transitionTimingFunction = tokenToTailwind(tokens.animation.easing, 'animation-easing');
    }
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
      extend: theme
    }
  };

  const content = `export default ${JSON.stringify(config, null, 2)};\n`;
  await writeFile(outputPath, content);
  console.log(`  ✓ ${outputPath}`);
}
