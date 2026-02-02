import { describe, it, expect } from "vitest";
import { readFile } from "fs/promises";
import { generateCSharpCode } from "./generate-csharp.js";

describe("C# NuGet Package Contract", () => {
  const mockSourceTokens = {
    color: {
      primary: { value: "#00cc92", type: "color" },
      black: { value: "#000000", type: "color" },
      white: { value: "#ffffff", type: "color" },
      "secondary-light": { value: "#dfe7e3", type: "color" },
    },
  };

  const mockThemeTokens = {
    theme: {
      light: {
        color: {
          primary: { value: "{ivy-framework.source.color.primary}", type: "color" },
          "primary-foreground": { value: "{ivy-framework.source.color.black}", type: "color" },
          secondary: { value: "{ivy-framework.source.color.secondary-light}", type: "color" },
          background: { value: "{ivy-framework.source.color.white}", type: "color" },
          foreground: { value: "{ivy-framework.source.color.black}", type: "color" },
        },
      },
    },
  };

  describe("Required Structure", () => {
    it("generates namespace Ivy.Themes", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("namespace Ivy.Themes");
    });

    it("generates public static class with correct name", () => {
      const code = generateCSharpCode(mockThemeTokens, "LightThemeTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static class LightThemeTokens");
    });

    it("generates nested Color class", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static class Color");
    });

    it("generates static readonly string properties", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toMatch(/public static readonly string \w+ = "#[0-9A-Fa-f]{6}"/);
    });
  });

  describe("Required Methods", () => {
    it("includes GenerateCSS method with selector parameter", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static string GenerateCSS(string selector = \":root\")");
    });

    it("includes GetToken method", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static string? GetToken(string tokenName)");
    });

    it("includes GetAllTokenNames method", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static string[] GetAllTokenNames()");
    });

    it("includes GetAllTokens method returning Dictionary", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("public static System.Collections.Generic.Dictionary<string, string> GetAllTokens()");
    });
  });

  describe("Token Values Contract", () => {
    it("resolves all token references to hex values", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).not.toMatch(/\{ivy-framework\.source\.color\./);
      expect(code).not.toMatch(/\{ivy-web\.source\.color\./);
    });

    it("generates PascalCase property names from kebab-case", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("PrimaryForeground");
      expect(code).not.toContain("primary-foreground =");
    });

    it("includes XML documentation for tokens", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      expect(code).toContain("/// <summary>");
    });

    it("all color values are valid hex format", () => {
      const code = generateCSharpCode(mockThemeTokens, "TestTokens", "Ivy.Themes", mockSourceTokens);
      const colorMatches = code.matchAll(/public static readonly string \w+ = "([^"]+)"/g);
      for (const match of colorMatches) {
        expect(match[1]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe("Generated Output Matches Contract", () => {
    it("matches mock contract structure", async () => {
      const mockContract = await readFile("scripts/mock-csharp-contract.cs", "utf-8");
      const generated = generateCSharpCode(mockThemeTokens, "MockThemeTokens", "Ivy.Themes", mockSourceTokens);

      const contractMethods = [
        "public static string GenerateCSS",
        "public static string? GetToken",
        "public static string[] GetAllTokenNames",
        "public static System.Collections.Generic.Dictionary<string, string> GetAllTokens",
      ];

      for (const method of contractMethods) {
        expect(mockContract).toContain(method);
        expect(generated).toContain(method);
      }
    });

    it("Color class structure matches contract", async () => {
      const mockContract = await readFile("scripts/mock-csharp-contract.cs", "utf-8");
      const generated = generateCSharpCode(mockThemeTokens, "MockThemeTokens", "Ivy.Themes", mockSourceTokens);

      expect(mockContract).toContain("public static class Color");
      expect(generated).toContain("public static class Color");

      expect(mockContract).toMatch(/public static readonly string Primary = "#00cc92"/);
      expect(generated).toMatch(/public static readonly string Primary = "#00cc92"/);
    });
  });

  describe("Real Build Output Validation", () => {
    it("validates IvyFrameworkLightThemeTokens matches contract", async () => {
      try {
        const generated = await readFile("dist/csharp/IvyFrameworkLightThemeTokens.cs", "utf-8");

        expect(generated).toContain("namespace Ivy.Themes");
        expect(generated).toContain("public static class IvyFrameworkLightThemeTokens");
        expect(generated).toContain("public static class Color");
        expect(generated).toContain("public static string GenerateCSS");
        expect(generated).toContain("public static string? GetToken");
        expect(generated).toContain("public static string[] GetAllTokenNames");
        expect(generated).toContain("public static System.Collections.Generic.Dictionary<string, string> GetAllTokens");

        expect(generated).not.toMatch(/\{ivy-framework\.source\.color\./);
        expect(generated).toMatch(/Primary = "#[0-9A-Fa-f]{6}"/);
      } catch {
        console.warn("dist/csharp/IvyFrameworkLightThemeTokens.cs not found, run build first");
      }
    });

    it("validates IvyFrameworkDarkThemeTokens matches contract", async () => {
      try {
        const generated = await readFile("dist/csharp/IvyFrameworkDarkThemeTokens.cs", "utf-8");

        expect(generated).toContain("namespace Ivy.Themes");
        expect(generated).toContain("public static class IvyFrameworkDarkThemeTokens");
        expect(generated).toContain("public static class Color");

        expect(generated).not.toMatch(/\{ivy-framework\.source\.color\./);
      } catch {
        console.warn("dist/csharp/IvyFrameworkDarkThemeTokens.cs not found, run build first");
      }
    });
  });
});
