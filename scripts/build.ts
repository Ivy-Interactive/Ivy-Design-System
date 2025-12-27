import { generateCSS } from "./generate-css.js";
import { generateFlatCSS } from "./generate-flat-css.js";
import { generateTailwind } from "./generate-tailwind.js";
import { generateTypes } from "./generate-types.js";
import { generateCSharp } from "./generate-csharp.js";
import { readFile, writeFile, mkdir, readdir, cp } from "fs/promises";

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

    // Extract ivy-framework tokens
    const ivyFramework = allTokens.core?.["ivy-framework"] || {};
    const ivyFrameworkSource = ivyFramework.source || {};
    const ivyFrameworkNeutral = ivyFramework.neutral || {};
    const ivyFrameworkChromatic = ivyFramework.chromatic || {};
    const ivyFrameworkLightTheme = {
      theme: { light: ivyFramework.theme?.light || {} },
    };
    const ivyFrameworkDarkTheme = {
      theme: { dark: ivyFramework.theme?.dark || {} },
    };

    // Extract ivy-web tokens
    const ivyWeb = allTokens.core?.["ivy-web"] || {};
    const ivyWebSource = ivyWeb.source || {};
    const ivyWebLightTheme = {
      theme: { light: ivyWeb.theme?.light || {} },
    };
    const ivyWebDarkTheme = {
      theme: { dark: ivyWeb.theme?.dark || {} },
    };

    console.log("  ✓ Ivy Framework tokens loaded");
    console.log("  ✓ Ivy Web tokens loaded\n");

    // Ensure dist directories exist
    console.log("📁 Creating output directories...");
    await mkdir("dist/css", { recursive: true });
    await mkdir("dist/tailwind", { recursive: true });
    await mkdir("dist/js", { recursive: true });
    await mkdir("dist/tokens", { recursive: true });
    await mkdir("dist/csharp", { recursive: true });
    console.log("  ✓ Directories created\n");

    // Generate CSS for ivy-framework
    console.log("📝 Generating CSS for ivy-framework...");
    await generateCSS(
      ivyFrameworkSource,
      "dist/css/ivy-framework-source.css",
      false,
      undefined
    );
    await generateCSS(
      ivyFrameworkNeutral,
      "dist/css/ivy-framework-neutral.css",
      false,
      ivyFrameworkSource
    );
    await generateCSS(
      ivyFrameworkChromatic,
      "dist/css/ivy-framework-chromatic.css",
      false,
      ivyFrameworkSource
    );
    await generateCSS(
      ivyFrameworkLightTheme,
      "dist/css/ivy-framework-light.css",
      false,
      ivyFrameworkSource
    );
    await generateCSS(
      ivyFrameworkDarkTheme,
      "dist/css/ivy-framework-dark.css",
      true,
      ivyFrameworkSource
    );

    // Generate flat CSS for ivy-framework
    await generateFlatCSS(
      ivyFrameworkSource,
      "dist/css/ivy-framework-source-flat.css",
      false,
      undefined
    );
    await generateFlatCSS(
      ivyFrameworkNeutral,
      "dist/css/ivy-framework-neutral-flat.css",
      false,
      ivyFrameworkSource
    );
    await generateFlatCSS(
      ivyFrameworkChromatic,
      "dist/css/ivy-framework-chromatic-flat.css",
      false,
      ivyFrameworkSource
    );
    await generateFlatCSS(
      ivyFrameworkDarkTheme,
      "dist/css/ivy-framework-dark-flat.css",
      true,
      ivyFrameworkSource
    );

    // Generate CSS for ivy-web
    console.log("📝 Generating CSS for ivy-web...");
    await generateCSS(
      ivyWebSource,
      "dist/css/ivy-web-source.css",
      false,
      undefined
    );
    await generateCSS(
      ivyWebLightTheme,
      "dist/css/ivy-web-light.css",
      false,
      ivyWebSource
    );
    await generateCSS(
      ivyWebDarkTheme,
      "dist/css/ivy-web-dark.css",
      true,
      ivyWebSource
    );

    // Generate flat CSS for ivy-web
    await generateFlatCSS(
      ivyWebSource,
      "dist/css/ivy-web-source-flat.css",
      false,
      undefined
    );
    await generateFlatCSS(
      ivyWebDarkTheme,
      "dist/css/ivy-web-dark-flat.css",
      true,
      ivyWebSource
    );
    console.log("");

    // Generate Tailwind configs
    console.log("🎨 Generating Tailwind configs...");
    await generateTailwind(
      ivyFrameworkSource,
      "dist/tailwind/ivy-framework.js"
    );
    console.log("");

    // Generate TypeScript types
    console.log("📘 Generating TypeScript types...");
    await generateTypes(ivyFrameworkSource);
    console.log("");

    // Generate C# classes for ivy-framework
    console.log("🔷 Generating C# classes for ivy-framework...");
    await generateCSharp(
      ivyFrameworkSource,
      "dist/csharp/IvyFrameworkSourceTokens.cs",
      "IvyFrameworkSourceTokens",
      "Ivy.Themes",
      undefined
    );
    await generateCSharp(
      ivyFrameworkNeutral,
      "dist/csharp/IvyFrameworkNeutralTokens.cs",
      "IvyFrameworkNeutralTokens",
      "Ivy.Themes",
      ivyFrameworkSource
    );
    await generateCSharp(
      ivyFrameworkChromatic,
      "dist/csharp/IvyFrameworkChromaticTokens.cs",
      "IvyFrameworkChromaticTokens",
      "Ivy.Themes",
      ivyFrameworkSource
    );
    await generateCSharp(
      ivyFrameworkLightTheme,
      "dist/csharp/IvyFrameworkLightThemeTokens.cs",
      "IvyFrameworkLightThemeTokens",
      "Ivy.Themes",
      ivyFrameworkSource
    );
    await generateCSharp(
      ivyFrameworkDarkTheme,
      "dist/csharp/IvyFrameworkDarkThemeTokens.cs",
      "IvyFrameworkDarkThemeTokens",
      "Ivy.Themes",
      ivyFrameworkSource
    );

    // Generate C# classes for ivy-web
    console.log("🔷 Generating C# classes for ivy-web...");
    await generateCSharp(
      ivyWebSource,
      "dist/csharp/IvyWebSourceTokens.cs",
      "IvyWebSourceTokens",
      "Ivy.Themes",
      undefined
    );
    await generateCSharp(
      ivyWebLightTheme,
      "dist/csharp/IvyWebLightThemeTokens.cs",
      "IvyWebLightThemeTokens",
      "Ivy.Themes",
      ivyWebSource
    );
    await generateCSharp(
      ivyWebDarkTheme,
      "dist/csharp/IvyWebDarkThemeTokens.cs",
      "IvyWebDarkThemeTokens",
      "Ivy.Themes",
      ivyWebSource
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

    // Copy fonts
    console.log("🔤 Copying fonts...");
    await cp("fonts", "dist/fonts", { recursive: true });
    console.log("  ✓ fonts -> dist/fonts");
    console.log("");

    const weightMap: Record<string, number> = {
      Thin: 100,
      ExtraLight: 200,
      Light: 300,
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
      ExtraBold: 800,
      Black: 900,
    };

    const fontFolders = await readdir("fonts");
    const fontFamilies: Array<{
      name: string;
      folder: string;
      weights: Array<{ weight: number; file: string }>;
    }> = [];

    const allowedWeights = [400, 500, 600, 700];

    for (const folder of fontFolders) {
      const files = await readdir(`fonts/${folder}`);
      const woff2Files = files.filter(
        (f: string) =>
          f.endsWith(".woff2") && !f.includes("[") && !f.includes("Italic")
      );

      const weights = woff2Files
        .map((file: string) => {
          const baseName = file.replace(".woff2", "");
          const parts = baseName.split("-");
          const weightName = parts[parts.length - 1];

          if (!weightMap[weightName]) return null;
          const weight = weightMap[weightName];
          if (!allowedWeights.includes(weight)) return null;
          return { weight, file: baseName };
        })
        .filter(
          (
            w: { weight: number; file: string } | null
          ): w is { weight: number; file: string } => w !== null
        )
        .sort(
          (a: { weight: number }, b: { weight: number }) => a.weight - b.weight
        );

      if (weights.length > 0) {
        const name = folder.replace(/([a-z])([A-Z])/g, "$1 $2");
        fontFamilies.push({ name, folder, weights });
      }
    }

    const fontFaceRules = fontFamilies
      .map((family) => {
        const comment = `/* ${family.name} Font Family */`;
        const rules = family.weights
          .map(
            ({ weight, file }) =>
              `@font-face {
  font-family: '${family.name}';
  src: url('../fonts/${family.folder}/${file}.woff2') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`
          )
          .join("\n\n");
        return `${comment}\n${rules}`;
      })
      .join("\n\n");

    await writeFile("dist/css/fonts.css", fontFaceRules + "\n");
    console.log("  ✓ dist/css/fonts.css");
    console.log("");

    console.log("✅ Build complete!\n");
    console.log("📦 Package contents:");
    console.log("  • CSS: dist/css/");
    console.log("  • Fonts: dist/fonts/");
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
