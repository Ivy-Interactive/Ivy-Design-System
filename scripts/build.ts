import { generateCSS } from "./generate-css.js";
import { generateFlatCSS } from "./generate-flat-css.js";
import { generateTailwind } from "./generate-tailwind.js";
import { generateTypes } from "./generate-types.js";
import { generateCSharp } from "./generate-csharp.js";
import { readFile, writeFile, mkdir } from "fs/promises";

/**
 * Validates that package.json and .csproj versions are synchronized
 */
async function validateVersions(): Promise<void> {
  const packageJson = JSON.parse(await readFile("package.json", "utf-8"));
  const csprojContent = await readFile("Ivy.DesignSystem.csproj", "utf-8");
  const versionMatch = csprojContent.match(/<Version>([\d.]+)<\/Version>/);

  const npmVersion = packageJson.version;
  const nugetVersion = versionMatch ? versionMatch[1] : null;

  if (!nugetVersion) {
    console.warn(
      "⚠️  Warning: Could not find version in Ivy.DesignSystem.csproj"
    );
    return;
  }

  if (npmVersion !== nugetVersion) {
    console.error("❌ Version mismatch detected!");
    console.error(`   npm:   ${npmVersion}`);
    console.error(`   NuGet: ${nugetVersion}`);
    console.error("\nRun: tsx scripts/sync-version.ts <version>");
    process.exit(1);
  }

  console.log(`📌 Version: ${npmVersion} (synchronized)\n`);
}

/**
 * Main build function
 */
async function build() {
  console.log("🏗️  Building Ivy Design System...\n");

  try {
    // Validate version synchronization
    await validateVersions();

    // Load tokens from single source of truth
    console.log("📖 Loading tokens...");
    const allTokens = JSON.parse(
      await readFile("figma-tokens/$tokens.json", "utf-8")
    );

    // Extract product and theme tokens
    const sourceTokens = allTokens.source || {};
    const lightTheme = { theme: { light: allTokens.theme?.light || {} } };
    const darkTheme = { theme: { dark: allTokens.theme?.dark || {} } };

    console.log("  ✓ Source tokens loaded");
    console.log("  ✓ Light theme loaded");
    console.log("  ✓ Dark theme loaded\n");

    // Ensure dist directories exist
    console.log("📁 Creating output directories...");
    await mkdir("dist/css", { recursive: true });
    await mkdir("dist/tailwind", { recursive: true });
    await mkdir("dist/js", { recursive: true });
    await mkdir("dist/tokens", { recursive: true });
    await mkdir("dist/csharp", { recursive: true });
    console.log("  ✓ Directories created\n");

    // Generate CSS
    console.log("📝 Generating CSS...");
    await generateCSS(sourceTokens, "dist/css/ivy-framework.css", false, undefined);
    await generateCSS(lightTheme, "dist/css/light.css", false, sourceTokens);
    await generateCSS(darkTheme, "dist/css/dark.css", true, sourceTokens);

    // Generate flat CSS for frontend compatibility
    await generateFlatCSS(
      sourceTokens,
      "dist/css/ivy-framework-flat.css",
      false,
      undefined
    );
    await generateFlatCSS(darkTheme, "dist/css/dark-flat.css", true, sourceTokens);
    console.log("");

    // Generate Tailwind configs
    console.log("🎨 Generating Tailwind configs...");
    await generateTailwind(
      sourceTokens,
      "dist/tailwind/ivy-framework.js"
    );
    console.log("");

    // Generate TypeScript types
    console.log("📘 Generating TypeScript types...");
    await generateTypes(sourceTokens);
    console.log("");

    // Generate C# classes
    console.log("🔷 Generating C# classes...");
    await generateCSharp(
      sourceTokens,
      "dist/csharp/IvyFrameworkTokens.cs",
      "IvyFrameworkTokens",
      "Ivy.Themes",
      undefined // No source tokens needed for source itself
    );
    await generateCSharp(
      lightTheme,
      "dist/csharp/LightThemeTokens.cs",
      "LightThemeTokens",
      "Ivy.Themes",
      sourceTokens // Pass source tokens to resolve references
    );
    await generateCSharp(
      darkTheme,
      "dist/csharp/DarkThemeTokens.cs",
      "DarkThemeTokens",
      "Ivy.Themes",
      sourceTokens // Pass source tokens to resolve references
    );
    console.log("");

    // Copy raw tokens
    console.log("📦 Copying raw tokens...");
    await writeFile(
      "dist/tokens/index.json",
      JSON.stringify(allTokens, null, 2)
    );
    console.log("  ✓ dist/tokens/index.json");
    console.log("");

    console.log("✅ Build complete!\n");
    console.log("📦 Package contents:");
    console.log("  • CSS: dist/css/");
    console.log("  • Tailwind: dist/tailwind/");
    console.log("  • JS/TS: dist/js/");
    console.log("  • C#: dist/csharp/");
    console.log("  • Raw tokens: dist/tokens/");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Run build
build().catch(console.error);
