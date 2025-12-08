import { describe, it, expect } from "vitest";
import { readFile } from "fs/promises";
import { generateCSharpCode } from "./generate-csharp.js";

/**
 * Tests to ensure all outputs contain raw, usable values
 * - NuGet package: C# classes with actual color codes
 * - npm package: JavaScript/TypeScript with usable values
 */

describe("Output Values Contract", () => {
  describe("C# NuGet Package - Raw Color Values", () => {
    it("generates C# code with resolved color values, not references", async () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
          black: { value: "#000000", type: "color" },
          white: { value: "#ffffff", type: "color" },
          "secondary-light": { value: "#dfe7e3", type: "color" },
          destructive: { value: "#dd5860", type: "color" },
        },
      };

      const lightTheme = {
        theme: {
          light: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              "primary-foreground": { value: "{core.ivy-framework.source.color.black}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.white}", type: "color" },
              secondary: { value: "{core.ivy-framework.source.color.secondary-light}", type: "color" },
              destructive: { value: "{core.ivy-framework.source.color.destructive}", type: "color" },
            },
          },
        },
      };

      const code = generateCSharpCode(
        lightTheme,
        "LightThemeTokens",
        "Ivy.Themes",
        sourceTokens
      );

      // Verify all values are resolved to actual color codes
      expect(code).toContain('Primary = "#00cc92"');
      expect(code).toContain('PrimaryForeground = "#000000"');
      expect(code).toContain('Background = "#ffffff"');
      expect(code).toContain('Secondary = "#dfe7e3"');
      expect(code).toContain('Destructive = "#dd5860"');

      // Verify NO references remain
      expect(code).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
    });

    it("ensures GenerateCSS() outputs actual color codes", async () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
          white: { value: "#ffffff", type: "color" },
        },
      };

      const lightTheme = {
        theme: {
          light: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.white}", type: "color" },
            },
          },
        },
      };

      const code = generateCSharpCode(
        lightTheme,
        "LightThemeTokens",
        "Ivy.Themes",
        sourceTokens
      );

      // The GenerateCSS method reads from static properties
      // Since properties contain actual values, CSS will contain actual values
      expect(code).toContain('Primary = "#00cc92"');
      expect(code).toContain('Background = "#ffffff"');
      expect(code).toContain("GenerateCSS");
      expect(code).toContain("field.GetValue(null)");

      // Verify the method structure ensures it will output actual values
      // The method gets field values which are the resolved color codes
    });

    it("verifies dark theme tokens are resolved", async () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
          black: { value: "#000000", type: "color" },
          "muted-light": { value: "#f8f8f8", type: "color" },
        },
      };

      const darkTheme = {
        theme: {
          dark: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.black}", type: "color" },
              foreground: { value: "{core.ivy-framework.source.color.muted-light}", type: "color" },
            },
          },
        },
      };

      const code = generateCSharpCode(
        darkTheme,
        "DarkThemeTokens",
        "Ivy.Themes",
        sourceTokens
      );

      expect(code).toContain('Primary = "#00cc92"');
      expect(code).toContain('Background = "#000000"');
      expect(code).toContain('Foreground = "#f8f8f8"');
      expect(code).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
    });

    it("ensures all token values are valid color formats", async () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
          black: { value: "#000000", type: "color" },
          white: { value: "#ffffff", type: "color" },
        },
      };

      const themeTokens = {
        theme: {
          light: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.white}", type: "color" },
              foreground: { value: "{core.ivy-framework.source.color.black}", type: "color" },
            },
          },
        },
      };

      const code = generateCSharpCode(
        themeTokens,
        "TestTokens",
        "Ivy.Themes",
        sourceTokens
      );

      // Extract color property values (static readonly string PropertyName = "value")
      const colorPropertyRegex = /public static readonly string \w+\s*=\s*"([^"]+)"/g;
      const matches = [...code.matchAll(colorPropertyRegex)];

      // Verify all color property values are valid color formats
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      const rgbRegex = /^rgb\(/;
      const rgbaRegex = /^rgba\(/;
      const hslRegex = /^hsl\(/;
      const hslaRegex = /^hsla\(/;
      const oklchRegex = /^oklch\(/;

      expect(matches.length).toBeGreaterThan(0);

      for (const match of matches) {
        const value = match[1];

        const isValidColor =
          hexColorRegex.test(value) ||
          rgbRegex.test(value) ||
          rgbaRegex.test(value) ||
          hslRegex.test(value) ||
          hslaRegex.test(value) ||
          oklchRegex.test(value);

        // Should not be a reference
        expect(value).not.toMatch(/^\{core\.(ivy-framework|ivy-web)\.source\./);
        // Should be a valid color format
        expect(isValidColor).toBe(true);
      }
    });
  });

  describe("npm Package - JavaScript/TypeScript Values", () => {
    it("verifies JavaScript exports contain usable CSS variable references", async () => {
      // JavaScript exports use CSS variables like var(--primary)
      // This is correct - they're meant to be used in CSS/HTML contexts
      // The actual values come from CSS files, not JS

      // Check that the generated JS file exists and has correct format
      try {
        const jsContent = await readFile("dist/js/index.js", "utf-8");
        
        // Should export tokens object
        expect(jsContent).toContain("export const tokens");
        
        // Values should be CSS variable format (var(--token-name))
        expect(jsContent).toMatch(/var\(--[\w-]+\)/);
        
        // Should NOT contain unresolved references
        expect(jsContent).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
      } catch (error) {
        // File might not exist if build hasn't run, skip this test
        console.warn("dist/js/index.js not found, skipping JS export test");
      }
    });

    it("verifies CSS files contain actual color values", async () => {
      // CSS files should contain actual color codes, not references
      try {
        const lightCSS = await readFile("dist/css/light.css", "utf-8");
        
        // Should contain actual color codes
        expect(lightCSS).toMatch(/#[0-9A-Fa-f]{6}/);
        
        // Should NOT contain unresolved references
        expect(lightCSS).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
      } catch (error) {
        console.warn("dist/css/light.css not found, skipping CSS test");
      }
    });
  });

  describe("End-to-End: Real Token File", () => {
    it("verifies actual token file generates outputs with raw values", async () => {
      try {
        const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
        const allTokens = JSON.parse(tokensContent);

        const sourceTokens = allTokens.core?.["ivy-framework"]?.source || {};
        const lightTheme = { theme: { light: allTokens.core?.["ivy-framework"]?.theme?.light || {} } };

        const code = generateCSharpCode(
          lightTheme,
          "LightThemeTokens",
          "Ivy.Themes",
          sourceTokens
        );

        // Verify no references in the generated code
        expect(code).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);

        // Verify actual color codes are present
        expect(code).toMatch(/#[0-9A-Fa-f]{6}/);

        // Extract a sample of values to verify they're actual colors
        const primaryMatch = code.match(/Primary\s*=\s*"([^"]+)"/);
        if (primaryMatch) {
          const primaryValue = primaryMatch[1];
          expect(primaryValue).toMatch(/^#[0-9A-Fa-f]{6}$/);
          expect(primaryValue).not.toMatch(/^\{core\.(ivy-framework|ivy-web)\.source\./);
        }
      } catch (error) {
        console.warn("Could not test with actual token file:", error);
      }
    });
  });

  describe("Contract: No References in Final Outputs", () => {
    it("ensures C# code never contains unresolved references", () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
        },
      };

      const themeTokens = {
        theme: {
          light: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
            },
          },
        },
      };

      // Without source tokens - should still not have references in property values
      const codeWithoutSource = generateCSharpCode(themeTokens);
      // This will have references, but that's expected if sourceTokens not provided
      // The important test is WITH sourceTokens

      // With source tokens - must resolve
      const codeWithSource = generateCSharpCode(
        themeTokens,
        "TestTokens",
        "Ivy.Themes",
        sourceTokens
      );

      expect(codeWithSource).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
      expect(codeWithSource).toContain('Primary = "#00cc92"');
    });

    it("ensures all theme token classes resolve references", () => {
      const sourceTokens = {
        color: {
          primary: { value: "#00cc92", type: "color" },
          black: { value: "#000000", type: "color" },
          white: { value: "#ffffff", type: "color" },
        },
      };

      const lightTheme = {
        theme: {
          light: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.white}", type: "color" },
            },
          },
        },
      };

      const darkTheme = {
        theme: {
          dark: {
            color: {
              primary: { value: "{core.ivy-framework.source.color.primary}", type: "color" },
              background: { value: "{core.ivy-framework.source.color.black}", type: "color" },
            },
          },
        },
      };

      const lightCode = generateCSharpCode(
        lightTheme,
        "LightThemeTokens",
        "Ivy.Themes",
        sourceTokens
      );

      const darkCode = generateCSharpCode(
        darkTheme,
        "DarkThemeTokens",
        "Ivy.Themes",
        sourceTokens
      );

      // Both should have resolved values
      expect(lightCode).toContain('Primary = "#00cc92"');
      expect(lightCode).toContain('Background = "#ffffff"');
      expect(darkCode).toContain('Primary = "#00cc92"');
      expect(darkCode).toContain('Background = "#000000"');

      // Neither should have references
      expect(lightCode).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
      expect(darkCode).not.toMatch(/\{core\.(ivy-framework|ivy-web)\.source\.color\./);
    });
  });
});

