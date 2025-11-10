import { generateCSS } from './generate-css.js';
import { generateFlatCSS } from './generate-flat-css.js';
import { generateTailwind } from './generate-tailwind.js';
import { generateTypes } from './generate-types.js';
import { generateCSharp } from './generate-csharp.js';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Validates that package.json and .csproj versions are synchronized
 */
async function validateVersions(): Promise<void> {
  const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
  const csprojContent = await readFile('Ivy.DesignSystem.csproj', 'utf-8');
  const versionMatch = csprojContent.match(/<Version>([\d.]+)<\/Version>/);

  const npmVersion = packageJson.version;
  const nugetVersion = versionMatch ? versionMatch[1] : null;

  if (!nugetVersion) {
    console.warn('⚠️  Warning: Could not find version in Ivy.DesignSystem.csproj');
    return;
  }

  if (npmVersion !== nugetVersion) {
    console.error('❌ Version mismatch detected!');
    console.error(`   npm:   ${npmVersion}`);
    console.error(`   NuGet: ${nugetVersion}`);
    console.error('\nRun: tsx scripts/sync-version.ts <version>');
    process.exit(1);
  }

  console.log(`📌 Version: ${npmVersion} (synchronized)\n`);
}

/**
 * Recursively loads all JSON token files from a directory
 */
async function loadTokens(dir: string): Promise<any> {
  const tokens: any = {};

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively load tokens from subdirectories
        const subTokens = await loadTokens(fullPath);
        // Merge tokens
        Object.assign(tokens, subTokens);
      } else if (entry.name.endsWith('.json')) {
        // Load and merge JSON file
        const content = await readFile(fullPath, 'utf-8');
        const data = JSON.parse(content);
        // Deep merge the tokens
        deepMerge(tokens, data);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error);
  }

  return tokens;
}

/**
 * Deep merge utility for token objects
 */
function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

/**
 * Main build function
 */
async function build() {
  console.log('🏗️  Building Ivy Design System...\n');

  try {
    // Validate version synchronization
    await validateVersions();

    // Load tokens from each directory
    console.log('📖 Loading tokens...');
    const coreTokens = await loadTokens('tokens/core');
    console.log('  ✓ Core tokens loaded');

    const ivyWebTokens = await loadTokens('tokens/products/ivy-web');
    console.log('  ✓ Ivy-Web tokens loaded');

    const ivyFrameworkTokens = await loadTokens('tokens/products/ivy-framework');
    console.log('  ✓ Ivy-Framework tokens loaded');

    const lightTheme = JSON.parse(await readFile('tokens/themes/light.json', 'utf-8'));
    console.log('  ✓ Light theme loaded');

    const darkTheme = JSON.parse(await readFile('tokens/themes/dark.json', 'utf-8'));
    console.log('  ✓ Dark theme loaded\n');

    // Ensure dist directories exist
    console.log('📁 Creating output directories...');
    await mkdir('dist/css', { recursive: true });
    await mkdir('dist/tailwind', { recursive: true });
    await mkdir('dist/js', { recursive: true });
    await mkdir('dist/tokens', { recursive: true });
    await mkdir('dist/csharp', { recursive: true });
    console.log('  ✓ Directories created\n');

    // Generate CSS
    console.log('📝 Generating CSS...');
    await generateCSS(coreTokens, 'dist/css/core.css');

    // Merge tokens for product-specific outputs
    const ivyWebMerged = deepMerge(deepMerge({}, coreTokens), ivyWebTokens);
    await generateCSS(ivyWebMerged, 'dist/css/ivy-web.css');

    const ivyFrameworkMerged = deepMerge(deepMerge({}, coreTokens), ivyFrameworkTokens);
    await generateCSS(ivyFrameworkMerged, 'dist/css/ivy-framework.css');

    await generateCSS(lightTheme, 'dist/css/light.css');
    await generateCSS(darkTheme, 'dist/css/dark.css', true);

    // Generate flat CSS for frontend compatibility
    await generateFlatCSS(ivyFrameworkMerged, 'dist/css/ivy-framework-flat.css');
    await generateFlatCSS(darkTheme, 'dist/css/dark-flat.css', true);
    console.log('');

    // Generate Tailwind configs
    console.log('🎨 Generating Tailwind configs...');
    await generateTailwind(coreTokens, 'dist/tailwind/core.js');
    await generateTailwind(ivyWebMerged, 'dist/tailwind/ivy-web.js');
    await generateTailwind(ivyFrameworkMerged, 'dist/tailwind/ivy-framework.js');
    console.log('');

    // Generate TypeScript types
    console.log('📘 Generating TypeScript types...');
    // Merge all tokens for complete type definitions
    const allTokens = deepMerge(
      deepMerge(deepMerge({}, coreTokens), ivyWebTokens),
      ivyFrameworkTokens
    );
    await generateTypes(allTokens);
    console.log('');

    // Generate C# classes
    console.log('🔷 Generating C# classes...');
    await generateCSharp(coreTokens, 'dist/csharp/CoreTokens.cs', 'CoreTokens');
    await generateCSharp(ivyFrameworkMerged, 'dist/csharp/IvyFrameworkTokens.cs', 'IvyFrameworkTokens');
    await generateCSharp(ivyWebMerged, 'dist/csharp/IvyWebTokens.cs', 'IvyWebTokens');
    await generateCSharp(lightTheme, 'dist/csharp/LightThemeTokens.cs', 'LightThemeTokens');
    await generateCSharp(darkTheme, 'dist/csharp/DarkThemeTokens.cs', 'DarkThemeTokens');
    console.log('');

    // Copy raw tokens
    console.log('📦 Copying raw tokens...');
    const rawTokens = {
      core: coreTokens,
      'ivy-web': ivyWebTokens,
      'ivy-framework': ivyFrameworkTokens,
      themes: {
        light: lightTheme,
        dark: darkTheme
      }
    };
    await writeFile('dist/tokens/index.json', JSON.stringify(rawTokens, null, 2));
    console.log('  ✓ dist/tokens/index.json');
    console.log('');

    console.log('✅ Build complete!\n');
    console.log('📦 Package contents:');
    console.log('  • CSS: dist/css/');
    console.log('  • Tailwind: dist/tailwind/');
    console.log('  • JS/TS: dist/js/');
    console.log('  • C#: dist/csharp/');
    console.log('  • Raw tokens: dist/tokens/');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build().catch(console.error);
